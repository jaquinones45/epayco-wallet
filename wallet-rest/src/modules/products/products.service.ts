import axios, { AxiosResponse } from 'axios';

import { BASE_URL } from '../../constants';

import { Product } from './dto/product.dto';
import { BuyProductDto } from './dto/buy-product.dto';
import { ConfirmPurchaseProductDto } from './dto/confirm-purchase-product.dto';

export const findAll = async (): Promise<AxiosResponse<Product[]>> => {
  const { data } = await axios.get(`${BASE_URL}/products`);
  return data;
}

export const findById = async (id: number): Promise<AxiosResponse<Product>> => {
  const { data } = await axios.get(`${BASE_URL}/products/${id}`);
  return data;
};

export const create = async (body: Product): Promise<AxiosResponse<Product>> => {
  const { data } = await axios.post(`${BASE_URL}/products`, body);
  return data;
};

export const update = async (id: number, body: Product): Promise<AxiosResponse<Product>> => {
  const { data } = await axios.put(`${BASE_URL}/products/${id}`, body);
  return data;
};

export const remove = async (id: number): Promise<AxiosResponse<Product>> => {
  const { data} = await axios.delete(`${BASE_URL}/products/${id}`);
  return data;
};

export const buyProduct = async (body: BuyProductDto): Promise<AxiosResponse<BuyProductDto>> => {
  const { data } = await axios.post(`${BASE_URL}/products/buy-product`, body);
  return data;
}

export const confirmPurchase = async (body: ConfirmPurchaseProductDto): Promise<AxiosResponse<ConfirmPurchaseProductDto>> => {
  return await axios.post(`${BASE_URL}/products/confirm-purchase`, body);
}