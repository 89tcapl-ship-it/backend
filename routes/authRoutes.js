import express from 'express';
import { setupSuperAdmin, login, getCurrentUser, getSetupStatus, forgotPassword, resetPassword } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/setup', setupSuperAdmin);
router.post('/login', login);
router.get('/setup-status', getSetupStatus);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', authenticate, getCurrentUser);

export default router;
