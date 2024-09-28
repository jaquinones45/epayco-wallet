import { Request, Response, Router } from 'express';

import { findAll, create, update, remove, buyProduct, confirmPurchase, findById } from './products.service';

const productRouter = Router();

productRouter
  .get('/', async (_req: Request, res: Response) => {
    try {
      const response = await findAll();
      return res.status(200).json(response);
    } catch (e: any) {
      const statusCode = e?.response?.data?.statusCode || 500;
      const message = e?.response?.data?.message || 'internal server error';
      return res.status(statusCode).json({ message });
    }
  })
  .get('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const response = await findById(Number(id));
      return res.status(200).json(response);
    } catch (e: any) {
      const statusCode = e?.response?.data?.statusCode || 500;
      const message = e?.response?.data?.message || 'internal server error';
      return res.status(statusCode).json({ message });
    }
  })
  .post('/', async (req: Request, res: Response) => {
    try {
      const { body } = req;
      const response = await create(body);
      return res.status(200).json(response);
    } catch (e: any) {
      const statusCode = e?.response?.data?.statusCode || 500;
      const message = e?.response?.data?.message || 'internal server error';
      return res.status(statusCode).json({ message });
    }
  })
  .post('/buy-product', async (req: Request, res: Response) => {
    try {
      const response = await buyProduct(req.body);
      return res.status(200).json(response);
    } catch (e: any) {
      const statusCode = e?.response?.data?.statusCode || 500;
      const message = e?.response?.data?.message || 'internal server error';
      return res.status(statusCode).json({ message });
    }
  })
  .post('/confirm-purchase', async (req: Request, res: Response) => {
    try {
      const response = await confirmPurchase(req.body);
      return res.status(200).json(response);
    } catch (e: any) {
      const statusCode = e?.response?.data?.statusCode || 500;
      const message = e?.response?.data?.message || 'internal server error';
      return res.status(statusCode).json({ message });
    }
  })
  .put('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { body } = req;
      const response = await update(Number(id), body);
      return res.status(200).json(response);
    } catch (e: any) {
      const statusCode = e?.response?.data?.statusCode || 500;
      const message = e?.response?.data?.message || 'internal server error';
      return res.status(statusCode).json({ message });
    }
  })
  .delete('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const response = await remove(Number(id));
      return res.status(200).json(response);
    } catch (e: any) {
      const statusCode = e?.response?.data?.statusCode || 500;
      const message = e?.response?.data?.message || 'internal server error';
      return res.status(statusCode).json({ message });
    }
  });

export default productRouter;