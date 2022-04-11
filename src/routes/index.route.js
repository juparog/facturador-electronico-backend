import express from 'express';
import * as homeController from '../controllers/home.cntroller';
import authRouter from './auth.route';
import authController from '../controllers/auth.controller';
import userRouter from './user.route';
import productRouter from './product.route';
import categoryRouter from './category.route';

const indexRouter = express.Router();

indexRouter.get('/api', homeController.indexPage);

indexRouter.use('/api/auth', authRouter);

indexRouter.use('/api/users', authController.authenticate, userRouter);

indexRouter.use(
  '/api/products',
  /* authController.authenticate, */ productRouter
);

indexRouter.use('/api/categories', categoryRouter);

export default indexRouter;
