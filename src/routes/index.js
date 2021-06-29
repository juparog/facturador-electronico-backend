import express from 'express';
import { indexPage, authenticate } from '../controllers/index';
import { router as routerUser } from './user';
import { router as routerAuth } from './auth';

const indexRouter = express.Router();

indexRouter.get('/', indexPage);

indexRouter.use('/users', authenticate, routerUser);

indexRouter.use('/auth', routerAuth);

export default indexRouter;
