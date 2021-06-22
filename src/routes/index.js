import express from 'express';
import { indexPage } from '../controllers/index';
import { router as routerUser } from './user';

const indexRouter = express.Router();

indexRouter.get('/', indexPage);

indexRouter.use('/users', routerUser);

export default indexRouter;
