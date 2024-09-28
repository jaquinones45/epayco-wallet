import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BuyProductDto } from './dto/buy-product.dto';
import { SendEmailDto } from './dto/send-email.dto';
import { ConfirmPurchaseProductDto } from './dto/confirm-purchase-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productsService.findOne(+id);
  }

  @Post()
  create(@Body() body: CreateProductDto) {
    return this.productsService.create(body);
  }

  @Post('/buy-product')
  buyProduct(@Body() body: BuyProductDto) {
    return this.productsService.buyProduct(body);
  }

  @Post('/confirm-purchase')
  confirmPurchase(@Body() body: ConfirmPurchaseProductDto) {
    return this.productsService.confirmPurchase(body);
  }

  @Post('/send-email')
  sendEmil(@Body() body: SendEmailDto) {
    return this.productsService.sendEmail(body);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: UpdateProductDto) {
    return this.productsService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productsService.remove(+id);
  }
}
