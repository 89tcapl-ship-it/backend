import multer from 'multer';

// Use memory storage for Cloudinary uploads
const storage = multer.memoryStorage();

// File filter - only allow images
// File filter - allow any file
const fileFilter = (req, file, cb) => {
    console.log('📂 filtering file:', file.originalname, file.mimetype);
    // Accept all files
    cb(null, true);
};

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024, // 20MB limit
    },
    fileFilter: fileFilter,
});

// Error handling middleware for multer
export const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Maximum size is 20MB.',
            });
        }
        return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`,
        });
    } else if (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
    next();
};

export default upload;
