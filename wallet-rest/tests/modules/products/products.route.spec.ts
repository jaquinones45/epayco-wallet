import request from 'supertest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import routes from '../../../src/routes';

import { BASE_URL } from '../../../src/constants';

const app = routes.server();

describe('test integrations products', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  it('should respond to findAll /api/products 200', async () => {
    const products = [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }];

    mock.onGet(`${BASE_URL}/products`).reply(200, products);

    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
  });

  it('should respond to findById /api/products/1 200', async () => {
    const product = { id: 1, name: 'User 1' };

    mock.onGet(`${BASE_URL}/products/1`).reply(200, product);

    const response = await request(app).get('/api/products/1');
    expect(response.status).toBe(200);
  });

  it('should respond to create /api/products 200', async () => {
    const newUser = {
      name: 'New User',
      document: '123456789',
      email: 'newproduct@example.com',
      password: 'password',
      phone: '1234567890',
    };

    mock.onPost(`${BASE_URL}/products`).reply(201, { id: 1, ...newUser });

    const response = await request(app).post('/api/products').send(newUser);
    expect(response.status).toBe(200);
  });

  it('should respond to create /api/products/buy-product 200', async () => {
    const buyProduct = {
      user_id: 1,
      wallet_id: 1,
      product_id: 1,
    };

    mock.onPost(`${BASE_URL}/products/buy-product`).reply(201, buyProduct);

    const response = await request(app).post('/api/products/buy-product').send(buyProduct);
    expect(response.status).toBe(200);
  });

  it('should respond to create /api/products/confirm-purchase 200', async () => {
    const confirmPurchase = {
      idSession: 'aa11-11-dd',
      token: 123456,
      user_id: 1,
      wallet_id: 1,
      product_id: 1,
    };

    mock.onPost(`${BASE_URL}/products/confirm-purchase`).reply(201, confirmPurchase);

    const response = await request(app).post('/api/products/confirm-purchase').send(confirmPurchase);
    expect(response.status).toBe(200);
  });


  it('should respond to update /api/products/1 200', async () => {
    const updatedUser = {
      id: 1,
      name: 'Updated User',
      document: '987654321',
      email: 'updatedproduct@example.com',
      password: 'newpassword',
      phone: '0987654321',
    };

    mock.onPut(`${BASE_URL}/products/${updatedUser.id}`).reply(200, updatedUser);

    const response = await request(app).put('/api/products/1').send(updatedUser);
    expect(response.status).toBe(200);
  });

  it('should respond to remove /api/products/1 200', async () => {
    const productId = 1;

    mock.onDelete(`${BASE_URL}/products/${productId}`).reply(200, { message: 'User deleted' });

    const response = await request(app).delete(`/api/products/${productId}`);
    expect(response.status).toBe(200);
  });
});
