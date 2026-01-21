import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        serviceInterest: {
            type: String,
            required: [true, 'Service interest is required'],
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
        },
        status: {
            type: String,
            enum: ['new', 'read', 'replied', 'archived'],
            default: 'new',
        },
        notes: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
