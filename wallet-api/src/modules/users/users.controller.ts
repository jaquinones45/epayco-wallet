import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';

import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BalanceUserDto } from './dto/balance-user.dto';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import { RechargeWalletUserDto } from './dto/recharge-wallet-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(+id);
  }

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Post('auth-login')
  authLogin(@Body() body: AuthLoginUserDto) {
    return this.usersService.authLogin(body);
  }

  @Post('balance')
  balance(@Body() body: BalanceUserDto) {
    return this.usersService.balance(body);
  }

  @Post('recharge-wallet')
  rechargeWallet(@Body() body: RechargeWalletUserDto) {
    return this.usersService.rechargeWallet(body);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: UpdateUserDto) {
    return this.usersService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(+id);
  }
}
