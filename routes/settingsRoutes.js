import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.get('/', getSettings);

// Admin route
router.put('/', authenticate, requireAdmin, updateSettings);

export default router;
