import express from 'express';
import {
    getPageContent,
    updatePageContent,
    addSection,
    updateSection,
    deleteSection,
} from '../controllers/pageContentController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public route - get page content
router.get('/:page', getPageContent);

// Admin routes - manage content
router.put('/:page', authenticate, requireAdmin, updatePageContent);
router.post('/:page/sections', authenticate, requireAdmin, addSection);
router.put('/:page/sections/:sectionId', authenticate, requireAdmin, updateSection);
router.delete('/:page/sections/:sectionId', authenticate, requireAdmin, deleteSection);

export default router;
