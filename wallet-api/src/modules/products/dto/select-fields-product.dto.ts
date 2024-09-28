export const SelectFieldsProductDto = () => ({
  select: {
    id: true,
    name: true,
    price: true,
    quantity: true,
    urlImage: true,
    buys: {
      id: true,
      state: true,
      user: {
        id: true,
        name: true,
        wallets: {
          id: true,
          value: true,
        },
      },
    },
    createdAt: true,
    updatedAt: true,
  },
  relations: {
    buys: {
      user: {
        wallets: true,
      },
    },
  },
});

export const SelectFieldsBuyProductDto = ({
  user_id,
  wallet_id,
  idSession,
  token,
  product_id,
}: {
  user_id: number;
  wallet_id: number;
  idSession: string;
  token: number;
  product_id: number;
}) => ({
  select: {
    id: true,
    wallets: {
      id: true,
      value: true,
    },
    buys: {
      id: true,
      product_id: true,
      state: true,
      product: {
        price: true,
        quantity: true,
      },
    },
  },
  where: {
    id: user_id,
    deletedAt: 0,
    wallets: {
      id: wallet_id,
      deletedAt: 0,
    },
    buys: {
      idSession,
      token,
      product_id,
      deletedAt: 0,
    },
  },
  relations: {
    wallets: true,
    buys: {
      product: true,
    },
  },
});
