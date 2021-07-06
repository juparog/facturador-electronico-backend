import express from 'express';
import { indexPage, authenticate } from '../controllers/index';
import { router as routerUser } from './user';
import { router as routerAuth } from './auth';

const indexRouter = express.Router();

indexRouter.get('/api', indexPage);

indexRouter.use('/api/users', authenticate, routerUser);

indexRouter.use('/api/auth', routerAuth);

export default indexRouter;
