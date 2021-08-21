import { Router } from 'express';
import userController from '../controllers/user';
import authController from '../controllers/auth';
import validationUser from '../middleware/validation/user';

const userRouter = Router();

userRouter.get('/', /* authController.authenticate, */ userController.getList);

userRouter.get('/:id', userController.getOneUser);

userRouter.post('/', validationUser.create, userController.create);

userRouter.put('/:id', userController.updateUser);

userRouter.delete('/:id', userController.updateUser);

export default userRouter;
