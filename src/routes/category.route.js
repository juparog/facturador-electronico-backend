import { Router } from 'express';
import categoyController from '../controllers/category.controller';

const categoryRouter = Router();

// Get /api/categories
categoryRouter.get('/', categoyController.getList);

// Get /api/categories
categoryRouter.post('/', categoyController.create);

export default categoryRouter;