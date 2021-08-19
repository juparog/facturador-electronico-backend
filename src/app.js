import cors from 'cors';
import logger from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';
import { swaggerSpec } from './config/docs/swaggerSpec';
import indexRouter from './routes/index';
import { dbSync } from './helpers/db';
import { configEnv } from './config/env/config';

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/', indexRouter);
app.use(
  '/api-docs',
  swaggerUI.serve,
  swaggerUI.setup(swaggerSpec, { explorer: true })
);
app.use('*', (req, res) => {
  res.json({ message: 'La ruta solicitada no existe' });
});

dbSync(configEnv.get('db.sync'));

export default app;
