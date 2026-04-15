import express from 'express';
import {
    getAllBlogPosts,
    getBlogPost,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
} from '../controllers/blogController.js';
import { authenticate, requireAdmin, optionalAuthenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes (with optional auth for admin view)
router.get('/', optionalAuthenticate, getAllBlogPosts);
router.get('/:id', optionalAuthenticate, getBlogPost);

// Admin routes
router.post('/', authenticate, requireAdmin, createBlogPost);
router.put('/:id', authenticate, requireAdmin, updateBlogPost);
router.delete('/:id', authenticate, requireAdmin, deleteBlogPost);

export default router;
