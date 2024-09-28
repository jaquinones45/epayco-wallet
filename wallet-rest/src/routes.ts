import express, { Application } from 'express';
import cors from 'cors';

import userRouter from './modules/users/users.route';

const server = () => {
  const app: Application = express();
  // middlewares
  app.use(express.json());
  app.use(cors());

  app.disable('x-powered-by');

  app.use('/api/users', userRouter);


  return app;
};

export default { server };
