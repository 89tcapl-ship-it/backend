import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
// Implicitly uses CLOUDINARY_URL from environment variables

/**
 * Upload image to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Object>} - Cloudinary upload result
 */
export const uploadToCloudinary = (fileBuffer, folder = 'business-ally') => {
    return new Promise((resolve, reject) => {
        // Debug Config
        if (!process.env.CLOUDINARY_URL) {
            console.error('❌ CLOUDINARY_URL not found in environment variables!');
        } else {
            // Hide secret for logs
            const maskedUrl = process.env.CLOUDINARY_URL.replace(/:[^:@]+@/, ':***@');
            console.log('✅ CLOUDINARY_URL found:', maskedUrl);
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'auto',
                transformation: []
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        uploadStream.end(fileBuffer);
    });
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} - Cloudinary delete result
 */
export const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw new Error(`Failed to delete image: ${error.message}`);
    }
};

export default cloudinary;
