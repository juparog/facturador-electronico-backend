import express from 'express';
import config from '../config/env/config';

const indexRouter = express.Router();

indexRouter.get('/', (req, res) => res.status(200).json({ message: 'Welcome to Express API template' }));

indexRouter.get('/envtest', (req, res) => res.status(200).json({ message: config.get('envtest') }));

export default indexRouter;
