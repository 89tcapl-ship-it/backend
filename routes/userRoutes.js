import express from 'express';
import { getAllUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { authenticate, requireSuperAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require super admin
router.use(authenticate, requireSuperAdmin);

router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
