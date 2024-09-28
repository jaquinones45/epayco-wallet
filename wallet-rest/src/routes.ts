import express, { Application } from 'express';
import cors from 'cors';

import userRouter from './modules/users/users.route';
import productRouter from './modules/products/products.route';

const server = () => {
  const app: Application = express();
  // middlewares
  app.use(express.json());
  app.use(cors());

  app.disable('x-powered-by');

  app.use('/api/users', userRouter);
  app.use('/api/products', productRouter);

  return app;
};

export default { server };
