import express from 'express';
import { indexPage } from '../controllers/index';
import { router as routerUser } from './user';
import { router as routerAuth } from './auth';

import { authenticate } from '../controllers';

const indexRouter = express.Router();

indexRouter.get('/', indexPage);

indexRouter.use('/users', authenticate, routerUser);

indexRouter.use('/auth', routerAuth);

export default indexRouter;
