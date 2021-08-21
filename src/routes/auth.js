import { Router } from 'express';
import authController from '../controllers/auth';
import * as validation from '../middleware/validation/auth';

const userRouter = Router();

// Post /api/auth/login
userRouter.post('/login', validation.login, authController.login);

// Post /api/auth/token
userRouter.post(
  '/token',
  authController.authenticate,
  validation.token,
  authController.token
);

// Post /api/auth/logout
userRouter.post('/logout', validation.logout, authController.logout);

// Post /api/auth/update-password
userRouter.post(
  '/update-password',
  authController.authenticate,
  validation.updatePassword,
  authController.updatePassword
);

// Post /api/auth/forgot-password
userRouter.post(
  '/forgot-password',
  validation.forgotPassword,
  authController.forgotPassword
);

// Post /api/auth/reset-password
userRouter.post(
  '/reset-password',
  validation.resetPassword,
  authController.resetPassword
);

export default userRouter;
