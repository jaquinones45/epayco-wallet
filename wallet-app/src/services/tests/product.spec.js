import axios from 'axios';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import MockAdapter from 'axios-mock-adapter';

import {
  allProducts,
  create,
  update,
  remove,
  buyProduct,
  confirmPurchase
} from '../product';
import { BASE_URL } from '../../constants';

describe('Product Service', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore(); // Limpia los mocks después de cada prueba
  });

  it('should fetch all products', async () => {
    const products = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];
    
    mock.onGet(`${BASE_URL}/products`).reply(200, products);

    const result = await allProducts();
    expect(result).toEqual(products);
  });

  it('should create a product', async () => {
    const newProduct = {
      name: 'New Product',
      price: 100,
      quantity: 10,
      urlImage: 'http://example.com/image.png',
    };

    mock.onPost(`${BASE_URL}/products`).reply(201, { id: 1, ...newProduct });

    const result = await create(newProduct);
    expect(result).toEqual({ id: 1, ...newProduct });
  });

  it('should update a product', async () => {
    const updatedProduct = {
      id: 1,
      name: 'Updated Product',
      price: 150,
      quantity: 20,
      urlImage: 'http://example.com/new-image.png',
    };

    mock.onPut(`${BASE_URL}/products/${updatedProduct.id}`).reply(200, updatedProduct);

    const result = await update(updatedProduct);
    expect(result).toEqual(updatedProduct);
  });

  it('should remove a product', async () => {
    const productId = 1;
    
    mock.onDelete(`${BASE_URL}/products/${productId}`).reply(200, { message: 'Product deleted' });

    const result = await remove({ id: productId });
    expect(result).toEqual({ message: 'Product deleted' });
  });

  it('should buy a product', async () => {
    const buyData = { user_id: 1, wallet_id: 1, product_id: 1 };
    
    mock.onPost(`${BASE_URL}/products/buy-product`).reply(200, { success: true });

    const result = await buyProduct(buyData);
    expect(result).toEqual({ success: true });
  });

  it('should confirm a purchase', async () => {
    const confirmData = {
      idSession: 'sessionId',
      token: 'token123',
      user_id: 1,
      wallet_id: 1,
      product_id: 1
    };
    
    mock.onPost(`${BASE_URL}/products/confirm-purchase`).reply(200, { success: true });

    const result = await confirmPurchase(confirmData);
    expect(result).toEqual({ success: true });
  });
});
