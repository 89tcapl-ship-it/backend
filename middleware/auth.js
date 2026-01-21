import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Authenticate user with JWT token
 */
export const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Authorization denied.',
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Authorization denied.',
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'User account is inactive. Authorization denied.',
            });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Authorization denied.',
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.',
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Server error during authentication.',
        });
    }
};

/**
 * Optional authentication
 * Does not block if no token, but attaches user if token is valid
 */
export const optionalAuthenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (user && user.isActive) {
            req.user = user;
        }
        next();
    } catch (error) {
        // If token is invalid, just proceed as unauthenticated
        next();
    }
};

/**
 * Require super admin role
 */
export const requireSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'super_admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Super admin privileges required.',
        });
    }
    next();
};

/**
 * Require admin or super admin role
 */
export const requireAdmin = (req, res, next) => {
    if (!['admin', 'super_admin'].includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.',
        });
    }
    next();
};

/**
 * Generate JWT token
 */
export const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};
