import axios, { AxiosResponse } from 'axios';

import { BASE_URL } from '../../constants';

import { User } from './dto/user.dto';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import { BalanceUserDto } from './dto/balance-user.dto';
import { RechargeWalletUserDto } from './dto/recharge-wallet-user.dto';

export const findAll = async (): Promise<AxiosResponse<User[]>> => {
  const { data } = await axios.get(`${BASE_URL}/users`);
  return data;
};

export const findById = async (id: number): Promise<AxiosResponse<User>> => {
  const { data } = await axios.get(`${BASE_URL}/users/${id}`);
  return data;
};

export const create = async (body: User): Promise<AxiosResponse<User>> => {
  const { data } = await axios.post(`${BASE_URL}/users`, body);
  return data;
};

export const update = async (id: number, body: User): Promise<AxiosResponse<User>> => {
  const { data } = await axios.put(`${BASE_URL}/users/${id}`, body);
  return data;
};

export const remove = async (id: number): Promise<AxiosResponse<User>> => {
  const { data} = await axios.delete(`${BASE_URL}/users/${id}`);
  return data;
};

export const authLogin = async (body: AuthLoginUserDto): Promise<AxiosResponse<User>> => {
  const { data } = await axios.post(`${BASE_URL}/users/auth-login`, body);
  return data;
};

export const balance = async (body: BalanceUserDto): Promise<AxiosResponse<BalanceUserDto>> => {
  const { data } = await axios.post(`${BASE_URL}/users/balance`, body);
  return data;
};

export const rechargeWallet = async (body: RechargeWalletUserDto): Promise<AxiosResponse<RechargeWalletUserDto>> => {
  const { data } = await axios.post(`${BASE_URL}/users/recharge-wallet`, body);
  return data;
};
