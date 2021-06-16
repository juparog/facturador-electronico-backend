import { Router } from 'express';
import { userList } from '../controllers';

const router = Router();

// Get /api/users
router.get('/', userList);

export { router };
