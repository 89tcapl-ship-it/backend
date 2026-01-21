import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import upload, { handleMulterError } from '../middleware/upload.js';

const router = express.Router();

// Admin only - upload single image
router.post(
    '/',
    authenticate,
    requireAdmin,
    upload.single('file'),
    handleMulterError,
    uploadImage
);

export default router;
