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
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    @InjectRepository(Buy) private buyRepository: Repository<Buy>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async findAll() {
    const selectFields = SelectFieldsProductDto();
    return await this.productRepository.find({
      where: { deletedAt: 0 },
      order: { createdAt: 'DESC' },
      select: selectFields.select,
      relations: selectFields.relations,
    });
  }

  async findOne(id: number) {
    const selectFields = SelectFieldsProductDto();
    const product = await this.productRepository.findOne({
      where: { id, deletedAt: 0 },
      select: selectFields.select,
      relations: selectFields.relations,
    });

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    return product;
  }

  async create(body: CreateProductDto) {
    const product = this.productRepository.create(body);
    const savedProduct = await this.productRepository.save(product);

    return {
      message: `The product ${savedProduct.name} was created successfully`,
      data: savedProduct,
    };
  }

  async buyProduct(body: BuyProductDto) {
    const { user_id, wallet_id, product_id } = body;

    const [user, wallet, product] = await Promise.all([
      this.findEntity(User, user_id),
      this.findEntity(Wallet, wallet_id),
      this.findEntity(Product, product_id),
    ]);

    await this.validateProductPurchase(product, wallet);

    const buyData = await this.createBuyRecord(product, user);
    await this.sendPurchaseEmail(product, buyData);

    return {
      message: 'An email has been sent with the session ID and token.',
      data: buyData,
    };
  }

  async confirmPurchase(body: ConfirmPurchaseProductDto) {
    const buyData = await this.findBuyData(body);

    const product = buyData?.product;
    const wallet = buyData?.user?.wallets[0];

    await this.validateConfirmedPurchase(product, wallet, buyData.state);

    await this.finalizePurchase(buyData, product, wallet);

    return {
      message: 'Purchase confirmed successfully',
      data: buyData,
    };
  }

  private async findEntity(entityClass: any, id: number) {
    const entity = await this[`${entityClass.name.toLowerCase()}Repository`].findOneBy({ id, deletedAt: 0 });
    if (!entity) {
      throw new HttpException(`${entityClass.name} with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return entity;
  }

  private async validateProductPurchase(product: Product, wallet: Wallet) {
    if (product.quantity <= 0) {
      throw new HttpException(`Product with id ${product.id} out of stock`, HttpStatus.BAD_REQUEST);
    }

    if (product.price > wallet.value) {
      throw new HttpException(`Insufficient funds in wallet with id ${wallet.id}`, HttpStatus.BAD_REQUEST);
    }

    const existingPurchase = await this.buyRepository.findOne({
      where: { product_id: product.id, user_id: wallet.id, state: StateProduct.PENDING, deletedAt: 0 },
    });
    if (existingPurchase) {
      throw new HttpException(`You have a pending purchase for ${product.name}`, HttpStatus.BAD_REQUEST);
    }
  }

  private async createBuyRecord(product: Product, user: User) {
    const buyData = this.buyRepository.create({
      price: product.price,
      quantity: 1,
      total: product.price,
      idSession: uuidv4(),
      token: Math.round(Math.random() * 999999),
      product,
      user,
    });
    return await this.buyRepository.save(buyData);
  }

  private async sendPurchaseEmail(product: Product, buyData: Buy) {
    const emailData = templateEmail({
      name: product.name,
      quantity: 1,
      price: product.price,
      idSession: buyData.idSession,
      token: buyData.token,
    });

    await this.sendEmail({
      to: buyData.user.email,
      subject: 'Product purchase confirmation',
      ...emailData,
    });
  }

  private async findBuyData(body: ConfirmPurchaseProductDto) {
    const buyData = await this.buyRepository.findOne({
      where: { idSession: body.idSession, token: body.token, user_id: body.user_id, product_id: body.product_id },
      relations: {
        product: true,
        user: {
          wallets: true,
        },
      },
    });

    if (!buyData) {
      throw new HttpException('No purchase found for the provided session ID and token', HttpStatus.NOT_FOUND);
    }

    return buyData;
  }

  private async validateConfirmedPurchase(product: Product, wallet: Wallet, state: StateProduct) {

    if (state !== StateProduct.PENDING) {
      throw new HttpException(`No pending purchase for product with id ${product.id}`, HttpStatus.NOT_FOUND);
    }

    if (product.quantity <= 0) {
      throw new HttpException(`Product with id ${product.id} out of stock`, HttpStatus.BAD_REQUEST);
    }

    if (product.price > wallet.value) {
      throw new HttpException(`Insufficient funds in wallet with id ${wallet.id}`, HttpStatus.BAD_REQUEST);
    }
  }

  private async finalizePurchase(buy: Buy, product: Product, wallet: Wallet) {
    await this.productRepository.update({ id: product.id }, { quantity: product.quantity - 1 });
    await this.buyRepository.update({ id: buy.id }, { state: StateProduct.COMPLETE });
    await this.walletRepository.update({ id: wallet.id }, { value: wallet.value - product.price });
  }

  async sendEmail(data: SendEmailDto) {
    const { from, to, subject, text, html } = data;
    const sender = from ?? {
      name: this.configService.get<string>('APP_NAME'),
      address: this.configService.get<string>('MAIL_DEFAULT_FROM'),
    };

    try {
      return await this.mailerService.sendMail({ from: sender, to, subject, text, html });
    } catch (error) {
      throw new HttpException(`Error sending email: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, body: UpdateProductDto) {
    await this.productRepository.update({ id }, body);
    const product = await this.findOne(id);
    return {
      message: `The product ${product.name} was updated successfully`,
      data: product,
    };
  }

  async remove(id: number) {
    const deletedAt = new Date().getTime();
    this.productRepository.update({ id }, { deletedAt });
    const productData = await this.findOne(id);

    return {
      message: `The product ${productData.name} was deleted successfully`,
      data: {
        id,
        deletedAt,
      },
    };
  }
}
