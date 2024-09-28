import axios from 'axios';

import { BASE_URL } from '../constants';

export const allUsers = async () => {
  const { data } = await axios.get(`${BASE_URL}/users`);
  return data;
};

export const create = async ({ name, document, email, password, phone }) => {
  const { data } = await axios.post(`${BASE_URL}/users`, {
    name,
    document,
    email,
    password,
    phone,
  });
  return data;
};

export const update = async ({ id, name, document, email, password, phone }) => {
  const { data } = await axios.put(`${BASE_URL}/users/${id}`, {
    name,
    document,
    email,
    password,
    phone,
  });
  return data;
};

export const remove = async ({ id }) => {
  const { data } = await axios.delete(`${BASE_URL}/users/${id}`);
  return data;
};

export const authLoginUser = async ({ email, password }) => {
  const { data } = await axios.post(`${BASE_URL}/users/auth-login`, {
    email,
    password,
  });
  return data;
};

export const balanceUser = async ({ document, phone }) => {
  const { data } = await axios.post(`${BASE_URL}/users/balance`, {
    document,
    phone,
  });
  return data;
};

export const rechargeWallet = async ({ document, phone, value }) => {
  const { data } = await axios.post(`${BASE_URL}/users/recharge-wallet`, {
    document,
    phone,
    value,
  });
  return data;
};

