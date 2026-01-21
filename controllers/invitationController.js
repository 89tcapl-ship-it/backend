import crypto from 'crypto';
import User from '../models/User.js';
import { sendInvitationEmail } from '../config/email.js';

// Invite a new admin user
export const inviteUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists',
            });
        }

        // Generate invitation token
        const invitationToken = crypto.randomBytes(32).toString('hex');
        const invitationExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        // Create user without password
        const user = await User.create({
            name,
            email,
            role: role || 'admin',
            isActive: false, // Inactive until password is set
            invitationToken,
            invitationExpires,
            passwordSetupComplete: false,
        });

        // Send invitation email
        const setupUrl = `${process.env.FRONTEND_URL}/setup-password/${invitationToken}`;
        await sendInvitationEmail(email, name, setupUrl);

        res.status(201).json({
            success: true,
            message: 'Invitation sent successfully',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Invite user error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to invite user',
        });
    }
};

// Setup password for invited user
export const setupPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters',
            });
        }

        // Find user by invitation token
        const user = await User.findOne({
            invitationToken: token,
            invitationExpires: { $gt: Date.now() },
        }).select('+invitationToken +invitationExpires');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired invitation token',
            });
        }

        // Set password and activate user
        user.password = password;
        user.passwordSetupComplete = true;
        user.isActive = true;
        user.invitationToken = undefined;
        user.invitationExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password set successfully. You can now login.',
        });
    } catch (error) {
        console.error('Setup password error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to setup password',
        });
    }
};

// Verify invitation token
export const verifyInvitation = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            invitationToken: token,
            invitationExpires: { $gt: Date.now() },
        }).select('name email role');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired invitation token',
            });
        }

        res.status(200).json({
            success: true,
            data: {
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Verify invitation error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to verify invitation',
        });
    }
};
