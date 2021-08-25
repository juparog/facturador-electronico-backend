import { Router } from 'express';
import userController from '../controllers/user';
import validationUser from '../middleware/validation/user';

const userRouter = Router();

// Get /api/users?sort=["updateAt","ASC"]&range=[0,10]&
// filter={"lastName":"Pacho"}&attributes=["firstName","email"]
userRouter.get('/', userController.getList);

// Get /api/users/{id}
userRouter.get('/:id', validationUser.getOne, userController.getOne);

// Pots /api/users/
userRouter.post('/', validationUser.create, userController.create);

userRouter.put('/:id', userController.updateUser);

userRouter.delete('/:id', userController.updateUser);

export default userRouter;
