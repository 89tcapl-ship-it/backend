import axios from 'axios';

/**
 * Verify Cloudflare Turnstile token
 * @param {string} token - The token from the frontend widget
 * @returns {Promise<boolean>} - True if valid, false otherwise
 */
export const verifyTurnstileToken = async (token) => {
    try {
        const secretKey = process.env.CLOUDFLARE_SECRET_KEY;

        if (!secretKey) {
            console.warn('⚠️ Cloudflare Secret Key not configured. Skipping Turnstile verification.');
            return true; // Fail open if not configured (dev mode) or return false to fail closed
        }

        if (!token) {
            return false;
        }

        const response = await axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            secret: secretKey,
            response: token,
        });

        return response.data.success;
    } catch (error) {
        console.error('❌ Turnstile verification error:', error.message);
        return false;
    }
};
