import { Router } from 'express';
import { listUser, createUser, updateUser } from '../controllers';

const router = Router();

// Get /api/users
router.get('/', listUser);

// Post /api/users
router.post('/', createUser);

// Put /api/users/:id
router.put('/:id', updateUser);

// Delete /api/users/:id
router.delete('/:id', (req, res) => res.status(200).json({id: req.params.id}));

export { router };
