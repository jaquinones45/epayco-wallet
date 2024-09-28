import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

import { CreateProductDto } from './dto/create-product.dto';
import {
  SelectFieldsBuyProductDto,
  SelectFieldsProductDto,
} from './dto/select-fields-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Product } from '../../entities/product.entity';
import { Wallet } from '../../entities/wallet.entity';
import { Buy } from '../../entities/buy.entity';
import { User } from '../../entities/user.entity';

import { SendEmailDto } from './dto/send-email.dto';
import { BuyProductDto } from './dto/buy-product.dto';

import { templateEmail } from '../../core/template';
import { StateProduct } from './dto/state-product.dto';
import { ConfirmPurchaseProductDto } from './dto/confirm-purchase-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Buy)
    private buyRepository: Repository<Buy>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  findAll() {
    const queryProductRepository = SelectFieldsProductDto();
    const products = this.productRepository.find({
      ...queryProductRepository,
      where: {
        deletedAt: 0,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return products;
  }

  async findOne(id: number) {
    const queryProductRepository = SelectFieldsProductDto();
    const product = await this.productRepository.findOne({
      ...queryProductRepository,
      where: {
        id,
        deletedAt: 0,
      },
    });

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    return product;
  }

  async create(body: CreateProductDto) {
    const data = await this.productRepository.create(body);
    const { id } = await this.productRepository.save(data);
    const userData = await this.findOne(id);
    return {
      message: `The product ${userData.name} was created successfully`,
      data: userData,
    };
  }

  async buyProduct(body: BuyProductDto) {
    const { user_id, wallet_id, product_id } = body;

    const user = await this.userRepository.findOneBy({
      id: user_id,
      deletedAt: 0,
    });
    if (!user)
      throw new HttpException(
        `User with id ${user_id} not found`,
        HttpStatus.NOT_FOUND,
      );

    const wallet = await this.walletRepository.findOneBy({
      id: wallet_id,
      deletedAt: 0,
    });
    if (!wallet)
      throw new HttpException(
        `Wallet with id ${wallet_id} not found`,
        HttpStatus.NOT_FOUND,
      );

    const product = await this.productRepository.findOneBy({
      id: product_id,
      deletedAt: 0,
    });
    if (!product)
      throw new HttpException(
        `Product with id ${product_id} not found`,
        HttpStatus.NOT_FOUND,
      );

    if (product.quantity <= 0)
      throw new HttpException(
        `Product with id ${product_id} out of stock`,
        HttpStatus.BAD_REQUEST,
      );

    if (Number(product.price) > Number(wallet.value))
      throw new HttpException(
        `Insufficient funds in wallet with id ${wallet_id}`,
        HttpStatus.BAD_REQUEST,
      );

    const buyExisting = await this.buyRepository.findOneBy({
      product_id,
      user_id,
      state: StateProduct.PENDING,
      deletedAt: 0,
    });
    if (buyExisting)
      throw new HttpException(
        `You have a pending purchase of the following product ${product.name}`,
        HttpStatus.BAD_REQUEST,
      );

    const idSession = uuidv4();
    const token = Math.round(Math.random() * 999999);
    const quantity = 1;

    const buyData = await this.buyRepository.create({
      price: Number(product.price),
      quantity: quantity,
      total: Number(product.price * quantity),
      idSession,
      token,
      product,
      user,
    });

    await this.buyRepository.save(buyData);

    const templateEmailData = templateEmail({
      name: product.name,
      quantity,
      price: Number(product.price),
      idSession,
      token,
    });

    this.sendEmail({
      to: user.email,
      subject: 'Product purchase confirmation',
      ...templateEmailData,
    });

    return {
      message: 'An email has been sent with the session ID and token that must be used in the purchase confirmation.',
      data: buyData,
    };
  }

  async confirmPurchase(body: ConfirmPurchaseProductDto) {
    const { idSession, token, user_id, wallet_id, product_id } = body;

    const queryUserRepository = SelectFieldsBuyProductDto({
      user_id,
      wallet_id,
      idSession,
      token,
      product_id,
    });

    const buyData = await this.userRepository.findOne(queryUserRepository);
    if (!buyData)
      throw new HttpException(
        `No purchase found for the session ID and token provided`,
        HttpStatus.NOT_FOUND,
      );

    const product = buyData?.buys[0]?.product;
    const wallet = buyData?.wallets[0];
    const buy = buyData?.buys[0];


    if (!buyData || buy.state !== StateProduct.PENDING)
      throw new HttpException(
        `There is no purchase for the product with id ${product_id}`,
        HttpStatus.NOT_FOUND,
      );

    if (product && product?.quantity <= 0)
      throw new HttpException(
        `Product with id ${product_id} out of stock`,
        HttpStatus.BAD_REQUEST,
      );

    if (Number(product && product?.price) > Number(wallet.value))
      throw new HttpException(
        `Insufficient funds in wallet with id ${wallet_id}`,
        HttpStatus.BAD_REQUEST,
      );

    await this.productRepository.update(
      { id: product_id },
      {
        quantity: product?.quantity - 1,
      },
    );

    await this.buyRepository.update(
      {
        id: buy.id,
      },
      {
        state: StateProduct.COMPLETE,
      },
    );

    await this.walletRepository.update(
      {
        id: wallet.id,
      },
      {
        value: Number(wallet.value - product.price),
      },
    );

    const data = await this.userRepository.find(queryUserRepository);

    return {
      message: 'Purchase confirmed successfully',
      data,
    };
  }

  async sendEmail(data: SendEmailDto) {
    const { from, to, subject, text, html } = data;

    const sender = from ?? {
      name: this.configService.get<string>('APP_NAME'),
      address: this.configService.get<string>('MAIL_DEFAULT_FROM'),
    };

    try {
      const result = await this.mailerService.sendMail({
        from: sender,
        to,
        subject,
        text,
        html,
      });
      return result;
    } catch (error) {
      throw new HttpException(
        `Error sending email: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, body: UpdateProductDto) {
    await this.productRepository.update({ id }, body);
    const userData = await this.findOne(id);

    return {
      message: `The product ${userData.name} was updated successfully`,
      data: userData,
    };
  }

  async remove(id: number) {
    const deletedAt = new Date().getTime();
    this.productRepository.update({ id }, { deletedAt });

    const userData = await this.findOne(id);

    return {
      message: `The product ${userData.name} was deleted successfully`,
      data: {
        id,
        deletedAt,
      },
    };
  }
}
