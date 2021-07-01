import logger from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import indexRouter from './routes/index';
import { dbSync } from './helpers/db';
import { configEnv } from './config/env/config';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Facturador Electrónico - API',
      version: '1.0.0',
      description: 'Esta API pertenece al proyecto del facturador electrónico',
    },
    servers: [
      {
        url: 'https://facturador-electronico-api.herokuapp.com/api',
      },
    ],
  },
  apis: [ './routes/index.js' ]
};

const specs = swaggerJSDoc(options);

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', indexRouter);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

dbSync(JSON.parse(JSON.stringify(configEnv.get('db.sync'))));

export default app;
