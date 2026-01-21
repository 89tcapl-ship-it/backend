import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Service title is required'],
            trim: true,
        },
        slug: {
            type: String,
            required: [true, 'Service slug is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        shortDescription: {
            type: String,
            required: [true, 'Short description is required'],
            trim: true,
        },
        description: {
            type: String, // Main detailed content in Markdown
            required: [true, 'Service description is required'],
        },
        image: {
            type: String,
            required: [true, 'Service image is required'],
        },
        features: {
            type: [String],
            default: [],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
serviceSchema.index({ slug: 1 });
serviceSchema.index({ isActive: 1, order: 1 });

// Auto-generate slug from title if not provided
serviceSchema.pre('save', function (next) {
    if (!this.slug && this.title) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }
    next();
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;
