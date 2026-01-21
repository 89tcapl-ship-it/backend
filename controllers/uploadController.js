import { uploadToCloudinary } from '../config/cloudinary.js';

/**
 * Upload image to Cloudinary
 * POST /api/upload
 */
export const uploadImage = async (req, res) => {
    try {
        console.log('📷 Upload request received');
        console.log('File:', req.file ? 'Present' : 'Missing');
        if (req.file) {
            console.log('File details:', {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded.',
            });
        }

        // Get folder from query or use default
        const folder = req.query.folder || 'business-ally';

        console.log(`Uploading to Cloudinary folder: ${folder}`);

        // Upload to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer, folder);

        console.log('✅ Upload success:', result.public_id);

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully.',
            data: {
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format,
            },
        });
    } catch (error) {
        console.error('❌ Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading image.',
            error: error.message,
        });
    }
};
