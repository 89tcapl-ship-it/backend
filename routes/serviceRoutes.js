import express from 'express';
import {
    getAllServices,
    getService,
    createService,
    updateService,
    deleteService,
} from '../controllers/serviceController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllServices);
router.get('/:slug', getService);

// Admin routes
router.post('/', authenticate, requireAdmin, createService);
router.put('/:id', authenticate, requireAdmin, updateService);
router.delete('/:id', authenticate, requireAdmin, deleteService);

export default router;
