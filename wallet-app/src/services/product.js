import axios from 'axios';

import { BASE_URL } from '../constants';

export const allProducts = async () => {
  const { data } = await axios.get(`${BASE_URL}/products`);
  return data;
};

export const create = async ({ name, price, quantity, urlImage }) => {
  const { data } = await axios.post(`${BASE_URL}/products`, {
    name,
    price,
    quantity,
    urlImage,
  });
  return data;
};

export const update = async ({ id, name, price, quantity, urlImage }) => {
  const { data } = await axios.put(`${BASE_URL}/products/${id}`, {
    name,
    price,
    quantity,
    urlImage,
  });
  return data;
};

export const remove = async ({ id }) => {
  const { data } = await axios.delete(`${BASE_URL}/products/${id}`);
  return data;
};


export const buyProduct = async ({ user_id, wallet_id, product_id }) => {
  const { data } = await axios.post(`${BASE_URL}/products/buy-product`, {
    user_id,
    wallet_id,
    product_id
  });
  return data;
};

export const confirmPurchase = async ({ idSession, token, user_id, wallet_id, product_id }) => {
  const { data } = await axios.post(`${BASE_URL}/products/confirm-purchase`, {
    idSession,
    token,
    user_id,
    wallet_id,
    product_id
  });
  return data;
};