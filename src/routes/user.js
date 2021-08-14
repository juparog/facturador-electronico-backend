import { Router } from 'express';
import * as userController from '../controllers/user';

const userRouter = Router();

userRouter.get('/', userController.getListUser);

userRouter.post('/', userController.createUser);

userRouter.put('/:id', userController.updateUser);

userRouter.delete('/:id', userController.updateUser);

export default userRouter;
