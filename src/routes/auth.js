import { Router } from 'express';
import { login, token, logout } from '../controllers';

const router = Router();

// Post /api/auth/login
router.post('/login', login);

// Post /api/auth/token
router.post('/token', token);

// Post /api/auth/logout
router.post('/logout', logout);

// Post /api/auth/forgot_password
router.post('/forgot_password', logout);

export { router };
