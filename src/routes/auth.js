import { Router } from 'express';
import { login, token, logout } from '../controllers';

const router = Router();

// Post /api/auth/login
router.post('/login', login);

// Post /api/auth/token
router.post('/token', token);

// Post /api/auth/logout
router.post('/token', logout);

export { router };
