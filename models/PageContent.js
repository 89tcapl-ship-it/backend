import mongoose from 'mongoose';

const pageContentSchema = new mongoose.Schema({
    page: {
        type: String,
        required: true,
        enum: ['home', 'about', 'services', 'blog', 'contact'],
        unique: true,
    },
    sections: [{
        sectionId: {
            type: String,
            required: true,
        },
        title: String,
        subtitle: String,
        content: String,
        buttonText: String,
        buttonLink: String,
        imageUrl: String,
        order: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    }],
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});

// Static method to get page content
pageContentSchema.statics.getPageContent = async function (pageName) {
    let content = await this.findOne({ page: pageName });

    // Create default content if doesn't exist
    if (!content) {
        content = await this.create({
            page: pageName,
            sections: getDefaultSections(pageName),
        });
    }

    return content;
};

// Default sections for each page
function getDefaultSections(pageName) {
    const defaults = {
        home: [
            {
                sectionId: 'hero',
                title: 'Your Trusted Partner in Corporate Compliance',
                subtitle: 'Expert guidance for startups and growing businesses',
                content: 'We provide comprehensive corporate advisory services including company registration, MCA compliance, GST, and taxation support.',
                buttonText: 'Get Started',
                buttonLink: '/contact',
                order: 1,
                isActive: true,
            },
            {
                sectionId: 'features',
                title: 'Why Choose Us',
                subtitle: 'Professional Excellence',
                content: 'Dedicated support for your business compliance needs',
                order: 2,
                isActive: true,
            },
        ],
        about: [
            {
                sectionId: 'intro',
                title: 'About 89T Corporate Advisors',
                subtitle: 'Your Compliance Partner',
                content: 'We are a compliance-focused corporate advisory firm dedicated to supporting startups and growing businesses with registration, taxation, and business advisory services.',
                order: 1,
                isActive: true,
            },
            {
                sectionId: 'mission',
                title: 'Our Mission',
                content: 'To simplify corporate compliance and empower businesses to focus on growth.',
                order: 2,
                isActive: true,
            },
        ],
        services: [],
        blog: [],
        contact: [
            {
                sectionId: 'header',
                title: 'Get in Touch',
                subtitle: 'We\'re here to help',
                content: 'Have questions about our services? Fill out the form below and our team will get back to you shortly.',
                order: 1,
                isActive: true,
            },
        ],
    };

    return defaults[pageName] || [];
}

const PageContent = mongoose.model('PageContent', pageContentSchema);

export default PageContent;
