import express from 'express';
import {
    inviteUser,
    setupPassword,
    verifyInvitation,
} from '../controllers/invitationController.js';
import { authenticate, requireSuperAdmin } from '../middleware/auth.js';

const router = express.Router();

// Super admin only - invite new admin
router.post('/invite', authenticate, requireSuperAdmin, inviteUser);

// Public routes - password setup
router.get('/verify/:token', verifyInvitation);
router.post('/setup/:token', setupPassword);

export default router;
