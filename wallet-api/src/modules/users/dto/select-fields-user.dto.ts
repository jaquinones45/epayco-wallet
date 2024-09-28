export const SelectFieldsUserDto = {
  id: true,
  name: true,
  document: true,
  email: true,
  password: false,
  phone: true,
  role: true,
  wallets: {
    id: true,
    value: true,
  },
  createdAt: true,
  updatedAt: true,
};
