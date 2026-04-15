import BlogPost from '../models/BlogPost.js';

/**
 * Get all blog posts
 * GET /api/blog
 */
export const getAllBlogPosts = async (req, res) => {
    try {
        const { status, category, page = 1, limit = 10 } = req.query;

        const query = {};

        // If user is not authenticated, only show published posts
        if (!req.user) {
            query.status = 'published';
        } else if (status) {
            query.status = status;
        }

        if (category) {
            query.category = category;
        }

        const skip = (page - 1) * limit;

        const posts = await BlogPost.find(query)
            .populate('author', 'name email')
            .sort({ publishedAt: -1, createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await BlogPost.countDocuments(query);

        res.status(200).json({
            success: true,
            count: posts.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: posts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching blog posts.',
            error: error.message,
        });
    }
};

/**
 * Get single blog post
 * GET /api/blog/:slug
 */
export const getBlogPost = async (req, res) => {
    try {
        const { id } = req.params;

        const query = { _id: id };

        // If user is not authenticated, only show published posts
        if (!req.user) {
            query.status = 'published';
        }

        const post = await BlogPost.findOne(query).populate('author', 'name email');

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found.',
            });
        }

        res.status(200).json({
            success: true,
            data: post,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching blog post.',
            error: error.message,
        });
    }
};

/**
 * Create blog post
 * POST /api/blog
 */
export const createBlogPost = async (req, res) => {
    try {
        const postData = {
            ...req.body,
            author: req.user._id,
        };

        const post = await BlogPost.create(postData);
        await post.populate('author', 'name email');

        res.status(201).json({
            success: true,
            message: 'Blog post created successfully.',
            data: post,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Blog post with this slug already exists.',
            });
        }
        console.error('❌ Error creating blog post:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating blog post.',
            error: error.message,
        });
    }
};

/**
 * Update blog post
 * PUT /api/blog/:id
 */
export const updateBlogPost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await BlogPost.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        }).populate('author', 'name email');

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Blog post updated successfully.',
            data: post,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Blog post with this slug already exists.',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error updating blog post.',
            error: error.message,
        });
    }
};

/**
 * Delete blog post
 * DELETE /api/blog/:id
 */
export const deleteBlogPost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await BlogPost.findByIdAndDelete(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Blog post deleted successfully.',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting blog post.',
            error: error.message,
        });
    }
};
