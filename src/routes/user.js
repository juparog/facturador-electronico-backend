import { Router } from 'express';
import { getListUser, createUser, updateUser } from '../controllers';

const router = Router();

// Get /api/users
router.get('/', getListUser);

// Post /api/users
router.post('/', createUser);

// Put /api/users/:id
router.put('/:id', updateUser);

// Delete /api/users/:id
router.delete('/:id', updateUser);

export { router };
