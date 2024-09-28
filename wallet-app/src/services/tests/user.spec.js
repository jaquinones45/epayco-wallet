import axios from 'axios';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import MockAdapter from 'axios-mock-adapter';

import {
  allUsers,
  create,
  update,
  remove,
  authLoginUser,
  balanceUser,
  rechargeWallet
} from '../user';
import { BASE_URL } from '../../constants';

describe('User Service', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore(); // Limpia los mocks después de cada prueba
  });

  it('should fetch all users', async () => {
    const users = [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }];

    mock.onGet(`${BASE_URL}/users`).reply(200, users);

    const result = await allUsers();
    expect(result).toEqual(users);
  });

  it('should create a user', async () => {
    const newUser = {
      name: 'New User',
      document: '123456789',
      email: 'newuser@example.com',
      password: 'password',
      phone: '1234567890',
    };

    mock.onPost(`${BASE_URL}/users`).reply(201, { id: 1, ...newUser });

    const result = await create(newUser);
    expect(result).toEqual({ id: 1, ...newUser });
  });

  it('should update a user', async () => {
    const updatedUser = {
      id: 1,
      name: 'Updated User',
      document: '987654321',
      email: 'updateduser@example.com',
      password: 'newpassword',
      phone: '0987654321',
    };

    mock.onPut(`${BASE_URL}/users/${updatedUser.id}`).reply(200, updatedUser);

    const result = await update(updatedUser);
    expect(result).toEqual(updatedUser);
  });

  it('should remove a user', async () => {
    const userId = 1;
    
    mock.onDelete(`${BASE_URL}/users/${userId}`).reply(200, { message: 'User deleted' });

    const result = await remove({ id: userId });
    expect(result).toEqual({ message: 'User deleted' });
  });

  it('should log in a user', async () => {
    const loginData = { email: 'user@example.com', password: 'password' };
    
    mock.onPost(`${BASE_URL}/users/auth-login`).reply(200, { token: 'abc123' });

    const result = await authLoginUser(loginData);
    expect(result).toEqual({ token: 'abc123' });
  });

  it('should get user balance', async () => {
    const balanceData = { document: '123456789', phone: '1234567890' };
    
    mock.onPost(`${BASE_URL}/users/balance`).reply(200, { balance: 100 });

    const result = await balanceUser(balanceData);
    expect(result).toEqual({ balance: 100 });
  });

  it('should recharge user wallet', async () => {
    const rechargeData = { document: '123456789', phone: '1234567890', value: 50 };
    
    mock.onPost(`${BASE_URL}/users/recharge-wallet`).reply(200, { success: true });

    const result = await rechargeWallet(rechargeData);
    expect(result).toEqual({ success: true });
  });
});
