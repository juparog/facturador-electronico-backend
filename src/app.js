import logger from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import indexRouter from './routes/index';
import { dbSync } from './helpers/db';
import { configEnv } from './config/env/config';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', indexRouter);

dbSync(JSON.parse(JSON.stringify(configEnv.get('db.sync'))));

export default app;
