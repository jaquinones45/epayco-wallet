import request from 'supertest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import routes from '../../../src/routes';

import { BASE_URL } from '../../../src/constants';
import { authLogin } from '../../../src/modules/users/users.service';

const app = routes.server();

describe('test integrations users', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  it('should respond to findAll /api/users 200', async () => {
    const users = [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }];

    mock.onGet(`${BASE_URL}/users`).reply(200, users);

    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
  });

  it('should respond to findById /api/users/1 200', async () => {
    const user = { id: 1, name: 'User 1' };

    mock.onGet(`${BASE_URL}/users/1`).reply(200, user);

    const response = await request(app).get('/api/users/1');
    expect(response.status).toBe(200);
  });

  it('should respond to create /api/users 200', async () => {
    const newUser = {
      name: 'New User',
      document: '123456789',
      email: 'newuser@example.com',
      password: 'password',
      phone: '1234567890',
    };

    mock.onPost(`${BASE_URL}/users`).reply(201, { id: 1, ...newUser });

    const response = await request(app).post('/api/users').send(newUser);
    expect(response.status).toBe(200);
  });

  it('should respond to create /api/users/auth-login 200', async () => {
    const authLogin = {
      email: 'newuser@example.com',
      password: 'password',
    };

    mock.onPost(`${BASE_URL}/users/auth-login`).reply(201, { id: 1, ...authLogin });

    const response = await request(app).post('/api/users/auth-login').send(authLogin);
    expect(response.status).toBe(200);
  });

  it('should respond to create /api/users/balance 200', async () => {
    const balanceUser = {
      document: '123456789',
      phone: '1234567890',
    };

    mock.onPost(`${BASE_URL}/users/balance`).reply(201, { id: 1, ...balanceUser });

    const response = await request(app).post('/api/users/balance').send(balanceUser);
    expect(response.status).toBe(200);
  });

  it('should respond to create /api/users/recharge-wallet 200', async () => {
    const rechargeWallet = {
      document: '123456789',
      phone: '1234567890',
      value: 100
    };

    mock.onPost(`${BASE_URL}/users/recharge-wallet`).reply(201, { id: 1, ...rechargeWallet });

    const response = await request(app).post('/api/users/recharge-wallet').send(rechargeWallet);
    expect(response.status).toBe(200);
  });

  it('should respond to update /api/users/1 200', async () => {
    const updatedUser = {
      id: 1,
      name: 'Updated User',
      document: '987654321',
      email: 'updateduser@example.com',
      password: 'newpassword',
      phone: '0987654321',
    };

    mock.onPut(`${BASE_URL}/users/${updatedUser.id}`).reply(200, updatedUser);

    const response = await request(app).put('/api/users/1').send(updatedUser);
    expect(response.status).toBe(200);
  });

  it('should respond to remove /api/users/1 200', async () => {
    const userId = 1;

    mock.onDelete(`${BASE_URL}/users/${userId}`).reply(200, { message: 'User deleted' });

    const response = await request(app).delete(`/api/users/${userId}`);
    expect(response.status).toBe(200);
  });
});
