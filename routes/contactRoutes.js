import express from 'express';
import {
    submitContactForm,
    getInbox,
    updateContactStatus,
    deleteContact,
    getInboxStats,
} from '../controllers/contactController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.post('/', submitContactForm);

// Admin routes
router.get('/inbox', authenticate, requireAdmin, getInbox);
router.get('/stats', authenticate, requireAdmin, getInboxStats);
router.put('/:id', authenticate, requireAdmin, updateContactStatus);
router.delete('/:id', authenticate, requireAdmin, deleteContact);

export default router;
