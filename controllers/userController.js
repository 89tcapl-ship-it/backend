import User from '../models/User.js';
import { sendWelcomeEmail } from '../config/email.js';

/**
 * Get all users
 * GET /api/users
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users.',
            error: error.message,
        });
    }
};

/**
 * Create new admin user
 * POST /api/users
 */
export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and password.',
            });
        }

        // Only super admin can create other super admins
        if (role === 'super_admin' && req.user.role !== 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'Only super admin can create other super admins.',
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'admin',
        });

        // Send welcome email (optional, don't fail if email fails)
        try {
            await sendWelcomeEmail({ name, email });
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
        }

        res.status(201).json({
            success: true,
            message: 'User created successfully.',
            data: user,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists.',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error creating user.',
            error: error.message,
        });
    }
};

/**
 * Update user
 * PUT /api/users/:id
 */
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, isActive, role } = req.body;

        // Find user
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        // Only super admin can change roles or update other super admins
        if (user.role === 'super_admin' && req.user.role !== 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'Only super admin can update other super admins.',
            });
        }

        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (typeof isActive === 'boolean') user.isActive = isActive;
        if (role && req.user.role === 'super_admin') user.role = role;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'User updated successfully.',
            data: user,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists.',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error updating user.',
            error: error.message,
        });
    }
};

/**
 * Delete user
 * DELETE /api/users/:id
 */
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Find user
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        // Prevent deleting yourself
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account.',
            });
        }

        // Only super admin can delete other super admins
        if (user.role === 'super_admin' && req.user.role !== 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'Only super admin can delete other super admins.',
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully.',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting user.',
            error: error.message,
        });
    }
};
