import { Router } from 'express';
import productController from '../controllers/product.controller';

const userRouter = Router();

// Get /api/products
userRouter.get('/', productController.getList);

export default userRouter;
