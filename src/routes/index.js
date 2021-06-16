import express from 'express';
import { indexPage } from '../controllers/index';

const indexRouter = express.Router();

indexRouter.get('/', indexPage);

export default indexRouter;
