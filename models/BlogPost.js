import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Blog title is required'],
            trim: true,
        },
        slug: {
            type: String,
            required: [true, 'Blog slug is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        excerpt: {
            type: String,
            required: [true, 'Blog excerpt is required'],
            maxlength: [300, 'Excerpt must be less than 300 characters'],
        },
        content: {
            type: String,
            required: [true, 'Blog content is required'],
        },
        featuredImage: {
            type: String,
            default: '',
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        category: {
            type: String,
            default: 'General',
        },
        tags: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'draft',
        },
        publishedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ category: 1 });

// Auto-generate slug from title if not provided
blogPostSchema.pre('validate', function (next) {
    if (!this.slug && this.title) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    // Set publishedAt when status changes to published
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }

    next();
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

export default BlogPost;
