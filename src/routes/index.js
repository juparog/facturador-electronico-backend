import express from 'express';
import * as homeController from '../controllers/home';
import authController from '../controllers/auth';
import userRouter from './user';
import productRouter from './product';
import authRouter from './auth';

const indexRouter = express.Router();

indexRouter.get('/api', homeController.indexPage);

indexRouter.use('/api/users', authController.authenticate, userRouter);

indexRouter.use('/api/products', /* authController.authenticate, */ productRouter);

indexRouter.use('/api/auth', authRouter);

export default indexRouter;
