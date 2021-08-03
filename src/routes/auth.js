import { Router } from 'express';
import * as authController from '../controllers/auth';
import * as validation from '../middleware/validation/auth';

const userRouter = Router();

// Post /api/auth/login
userRouter.post('/login', validation.login, authController.login);

// Post /api/auth/token
userRouter.post('/token', validation.token, authController.token);

// Post /api/auth/logout
userRouter.post('/logout', validation.logout, authController.logout);

// Post /api/auth/update-password
userRouter.post(
  '/update-password',
  authController.authenticate,
  authController.updatePassword
);

// Post /api/auth/forgot-password
userRouter.post('/forgot-password', authController.forgotPassword);

// Post /api/auth/reset-password
userRouter.post('/reset-password', authController.resetPassword);

export default userRouter;
