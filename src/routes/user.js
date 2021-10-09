import { Router } from 'express';
import userController from '../controllers/user';
import validationUser from '../middleware/validation/user';

const userRouter = Router();

// Get /api/users?sort=["updateAt","ASC"]&range=[0,10]&
// filter={"lastName":"Pacho"}&attributes=["firstName","email"]
userRouter.get('/', validationUser.getList, userController.getList);

// Get /api/users/{id}
userRouter.get('/:documentNumber', validationUser.getOne, userController.getOne);

// Get /api/users/?filter={"id":[123,456,789]}
userRouter.get('/', validationUser.getMany, userController.getMany);

// Pots /api/users/
userRouter.post('/', validationUser.create, userController.create);

// Put /api/users/:documentNumber
userRouter.put('/:documentNumber', validationUser.update, userController.update);

userRouter.delete('/:documentNumber', userController.update);

export default userRouter;
