// src/routes/users.js
import express from 'express';
import { getUsers, getUser, updateUser, deleteUser } from '../controllers/usersController.js';
import { authMiddleware, requireRole } from '../middlewares/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', requireRole('admin', 'super_admin'), getUsers);
router.get('/:id', getUser);
router.put('/:id', requireRole('admin', 'super_admin'), updateUser);
router.delete('/:id', requireRole('admin', 'super_admin'), deleteUser);

export default router;
