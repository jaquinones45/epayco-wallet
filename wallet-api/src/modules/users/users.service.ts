import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { SelectFieldsUserDto } from './dto/select-fields-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RechargeWalletUserDto } from './dto/recharge-wallet-user.dto';

import { User } from '../../entities/user.entity';
import { Wallet } from '../../entities/wallet.entity';

import { BalanceUserDto } from './dto/balance-user.dto';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
  ) {}

  findAll() {
    const users = this.userRepository.find({
      select: SelectFieldsUserDto,
      where: {
        deletedAt: 0,
      },
      relations: {
        wallets: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      select: SelectFieldsUserDto,
      where: {
        id,
        deletedAt: 0,
      },
      relations: {
        wallets: true,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async create(body: CreateUserDto) {
    const user: User = await this.userRepository.create(body);

    const wallet = new Wallet();
    wallet.value = 0;
    wallet.user = user;

    await this.walletRepository.save(wallet);
    user.wallets = [wallet];

    const { id } = await this.userRepository.save(user);
    const userData = await this.findOne(id);
    return {
      message: `The user ${userData.name} was created successfully`,
      data: userData,
    };
  }

  async authLogin(body: AuthLoginUserDto) {
    const { email, password } = body;
    const user = await this.userRepository.findOne({
      select: {
        ...SelectFieldsUserDto,
        password: true,
      },
      where: {
        email,
        deletedAt: 0,
      },
      relations: {
        wallets: true,
      },
    });

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user) {
      throw new HttpException(
        'Email or Password do not match',
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async balance(body: BalanceUserDto) {
    const { document, phone } = body;
    const user = await this.userRepository.findOne({
      select: {
        wallets: {
          value: true,
        },
      },
      relations: {
        wallets: true,
      },
      where: {
        document,
        phone,
        deletedAt: 0,
      },
    });

    if (!user) {
      throw new HttpException('User data does not match', HttpStatus.NOT_FOUND);
    }

    const balance = user?.wallets[0] ? user.wallets[0].value : 0;

    return {
      message: `the balance query is for ${balance}`,
      data: {
        balance,
      },
    };
  }

  async rechargeWallet(body: RechargeWalletUserDto) {
    const { document, phone, value } = body;

    const user = await this.userRepository.findOne({
      select: {
        wallets: {
          id: true,
          value: true,
        },
      },
      where: {
        document,
        phone,
        deletedAt: 0,
        wallets: {
          deletedAt: 0,
        },
      },
      relations: {
        wallets: true,
      },
    });

    if (!user) {
      throw new HttpException('User data does not match', HttpStatus.NOT_FOUND);
    }

    const wallet = user.wallets[0];
    const valueWallet = Number(wallet.value) + Number(value);

    await this.walletRepository.update(
      {
        id: wallet.id,
      },
      {
        value: valueWallet,
      },
    );

    return {
      message: `Wallet was recharged with ${valueWallet} successfully`,
      data: {
        ...wallet,
        value: valueWallet,
      },
    };
  }

  async update(id: number, body: UpdateUserDto) {
    await this.userRepository.update({ id }, body);
    const userData = await this.findOne(id);
    return {
      message: `The user ${userData.name} was updeted successfully`,
      data: userData,
    };
  }

  async remove(id: number) {
    const deletedAt = new Date().getTime();
    this.userRepository.update({ id }, { deletedAt });
    const userData = await this.findOne(id);

    return {
      message: `The user ${userData.name} was deleted successfully`,
      data: {
        id,
        deletedAt,
      },
    };
  }
}
