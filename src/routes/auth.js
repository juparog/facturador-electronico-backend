import { Router } from 'express';
import {
  authenticate,
  login,
  token,
  logout,
  updatePassword,
  forgotPassword,
  resetPassword,
} from '../controllers';

const router = Router();

// Post /api/auth/login
router.post('/login', login);

// Post /api/auth/token
router.post('/token', token);

// Post /api/auth/logout
router.post('/logout', logout);

// Post /api/auth/update-password
router.post('/update-password', authenticate, updatePassword);

// Post /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);

// Post /api/auth/reset-password
router.post('/reset-password', resetPassword);

export { router };
