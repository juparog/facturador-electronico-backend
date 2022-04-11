import { Router } from 'express';
import authController from '../controllers/auth.controller';
import validationAuth from '../middlewares/auth.middleware';

const userRouter = Router();

// Post /api/auth/login
userRouter.post('/login', validationAuth.login, authController.login);

// Post /api/auth/token
userRouter.post(
  '/token',
  authController.authenticate,
  validationAuth.token,
  authController.token
);

// Post /api/auth/logout
userRouter.post('/logout', validationAuth.logout, authController.logout);

// Post /api/auth/update-password
userRouter.post(
  '/update-password',
  authController.authenticate,
  validationAuth.updatePassword,
  authController.updatePassword
);

// Post /api/auth/forgot-password
userRouter.post(
  '/forgot-password',
  validationAuth.forgotPassword,
  authController.forgotPassword
);

// Post /api/auth/reset-password
userRouter.post(
  '/reset-password',
  validationAuth.resetPassword,
  authController.resetPassword
);

export default userRouter;
