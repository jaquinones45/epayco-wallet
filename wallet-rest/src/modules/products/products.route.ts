import { Request, Response, Router } from 'express';

import { findAll, create, update, remove, buyProduct, confirmPurchase, findById, purchase } from './products.service';

const productRouter = Router();

productRouter
  .get('/', async (_req: Request, res: Response) => {
    try {
      const response = await findAll();
      return res.status(200).json(response);
    } catch (e: any) {
      return res.status(e?.response?.data?.statusCode).json({ message: e?.response?.data?.message });
    }
  })
  .get('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const response = await findById(Number(id));
      return res.status(200).json(response);
    } catch (e: any) {
      return res.status(e?.response?.data?.statusCode).json({ message: e?.response?.data?.message });
    }
  })
  .post('/', async (req: Request, res: Response) => {
    try {
      const { body } = req;
      const response = await create(body);
      return res.status(200).json(response);
    } catch (e: any) {
      return res.status(e?.response?.data?.statusCode).json({ message: e?.response?.data?.message });
    }
  })
  .post('/buy-product', async (req: Request, res: Response) => {
    try {
      const response = await buyProduct(req.body);
      return res.status(200).json(response);
    } catch (e: any) {
      return res.status(e?.response?.data?.statusCode).json({ message: e?.response?.data?.message });
    }
  })
  .post('/confirm-purchase', async (req: Request, res: Response) => {
    try {
      const response = await confirmPurchase(req.body);
      return res.status(200).json(response);
    } catch (e: any) {
      return res.status(e?.response?.data?.statusCode).json({ message: e?.response?.data?.message });
    }
  })
  .post('/purchase', async (req: Request, res: Response) => {
    try {
      const response = await purchase(req.body);
      return res.status(200).json(response);
    } catch (e: any) {
      return res.status(e?.response?.data?.statusCode).json({ message: e?.response?.data?.message });
    }
  })
  .put('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { body } = req;
      const response = await update(Number(id), body);
      return res.status(200).json(response);
    } catch (e: any) {
      return res.status(e?.response?.data?.statusCode).json({ message: e?.response?.data?.message });
    }
  })
  .delete('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const response = await remove(Number(id));
      return res.status(200).json(response);
    } catch (e: any) {
      return res.status(e?.response?.data?.statusCode).json({ message: e?.response?.data?.message });
    }
  });

export default productRouter;