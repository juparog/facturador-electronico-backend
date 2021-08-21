import { Router } from 'express';
import userController from '../controllers/user';
import authController from '../controllers/auth';

const userRouter = Router();

userRouter.get('/', /* authController.authenticate, */ userController.getList);

userRouter.get('/:id', userController.getOneUser);

userRouter.post('/', userController.createUser);

userRouter.put('/:id', userController.updateUser);

userRouter.delete('/:id', userController.updateUser);

export default userRouter;
