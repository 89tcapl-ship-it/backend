import Contact from '../models/Contact.js';
import { sendContactNotification, sendAutoReply } from '../config/email.js';

/**
 * Submit contact form
 * POST /api/contact
 */
export const submitContactForm = async (req, res) => {
    try {
        const { fullName, email, phone, serviceInterest, message } = req.body;

        // Validate input
        if (!fullName || !email || !phone || !serviceInterest || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.',
            });
        }

        // Create contact entry
        const contact = await Contact.create({
            fullName,
            email,
            phone,
            serviceInterest,
            message,
        });

        // Send email notification to admin and auto-reply to user
        try {
            await Promise.all([
                sendContactNotification({
                    fullName,
                    email,
                    phone,
                    serviceInterest,
                    message,
                }),
                sendAutoReply({
                    fullName,
                    email,
                    serviceInterest,
                }),
            ]);
        } catch (emailError) {
            console.error('Failed to send email notifications:', emailError);
            // Don't fail the request if email fails
        }

        res.status(201).json({
            success: true,
            message: 'Thank you for contacting us! We will get back to you soon.',
            data: contact,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error submitting contact form.',
            error: error.message,
        });
    }
};

/**
 * Get all contact messages (admin)
 * GET /api/contact/inbox
 */
export const getInbox = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 20 } = req.query;

        // Build query
        const query = {};
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { message: { $regex: search, $options: 'i' } },
            ];
        }

        // Pagination
        const skip = (page - 1) * limit;

        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Contact.countDocuments(query);

        res.status(200).json({
            success: true,
            count: contacts.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: contacts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching inbox.',
            error: error.message,
        });
    }
};

/**
 * Update contact message status
 * PUT /api/contact/:id
 */
export const updateContactStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const contact = await Contact.findById(id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found.',
            });
        }

        if (status) contact.status = status;
        if (notes !== undefined) contact.notes = notes;

        await contact.save();

        res.status(200).json({
            success: true,
            message: 'Contact updated successfully.',
            data: contact,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating contact.',
            error: error.message,
        });
    }
};

/**
 * Delete contact message
 * DELETE /api/contact/:id
 */
export const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await Contact.findById(id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found.',
            });
        }

        await contact.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Contact deleted successfully.',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting contact.',
            error: error.message,
        });
    }
};

/**
 * Get inbox statistics
 * GET /api/contact/stats
 */
export const getInboxStats = async (req, res) => {
    try {
        const total = await Contact.countDocuments();
        const newMessages = await Contact.countDocuments({ status: 'new' });
        const read = await Contact.countDocuments({ status: 'read' });
        const replied = await Contact.countDocuments({ status: 'replied' });
        const archived = await Contact.countDocuments({ status: 'archived' });

        res.status(200).json({
            success: true,
            data: {
                total,
                new: newMessages,
                read,
                replied,
                archived,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching stats.',
            error: error.message,
        });
    }
};
