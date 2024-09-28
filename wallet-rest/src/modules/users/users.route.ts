import { Request, Response, Router } from 'express';

import { findAll, create, update, remove, authLogin, balance, rechargeWallet, findById } from './users.service';

const productRouter = Router();

productRouter
  .get('/', async (req: Request, res: Response) => {
    try {
      const response = await findAll();
      return res.status(200).json(response);
    } catch (e: any) {
      return res.status(e.response.data.statusCode).json({ message: e.response.data.message });
    }
  })
  .get('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const response = await findById(Number(id));
      return res.status(200).json(response);
    } catch (e: any) {
      return res.status(e.response.data.statusCode).json({ message: e.response.data.message });
    }
  })
  .post('/', async (req: Request, res: Response) => {
    try {
      const { body } = req;
      const response = await create(body);
      return res.status(200).json(response);
    } catch (e: any) {
      return res.status(e.response.data.statusCode).json({ message: e.response.data.message });
    }
  })
  .post('/auth-login', async (req: Request, res: Response) => {
    try {
      const { body } = req;
      const response = await authLogin(body);
      return res.status(200).json(response);
    } catch (e: any) {
      return res.status(e.response.data.statusCode).json({ message: e.response.data.message });
    }
  })
  .post('/balance', async (req: Request, res: Response) => {
    try {
      const { body } = req;
      const response = await balance(body);
      return res.status(200).json(response);
    } catch (e: any) {
      return res.status(e.response.data.statusCode).json({ message: e.response.data.message });
    }
  })
  .post('/recharge-wallet', async (req: Request, res: Response) => {
    try {
      const { body } = req;
      const response = await rechargeWallet(body);
      return res.status(200).json(response);
    } catch (e: any) {
      return res.status(e.response.data.statusCode).json({ message: e.response.data.message });
    }
  })
  .put('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { body } = req;
      const response = await update(Number(id), body);
      return res.status(200).json(response);
    } catch (e: any) {
      return res.status(e.response.data.statusCode).json({ message: e.response.data.message });
    }
  })
  .delete('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const response = await remove(Number(id));
      return res.status(200).json(response);
    } catch (e: any) {
      return res.status(e.response.data.statusCode).json({ message: e.response.data.message });
    }
  });

export default productRouter;