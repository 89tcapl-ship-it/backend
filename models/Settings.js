import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
    {
        siteName: {
            type: String,
            default: '89T Corporate Advisors',
        },
        siteDescription: {
            type: String,
            default: 'A compliance-focused corporate advisory firm supporting startups and growing businesses.',
        },
        contactEmail: {
            type: String,
            default: '89tcapl@gmail.com',
        },
        contactPhone: {
            type: String,
            default: '',
        },
        address: {
            type: String,
            default: 'No.226/400, Sapthagiri Arc, Block No.206, 2nd Floor, Hoodi, Bangalore - 560048',
        },
        companyInfo: {
            cin: {
                type: String,
                default: 'U69201KA2025PTC213011',
            },
            incorporationDate: {
                type: String,
                default: '23 Dec 2025',
            },
            status: {
                type: String,
                default: 'Active',
            },
        },
        socialLinks: {
            facebook: { type: String, default: '' },
            twitter: { type: String, default: '' },
            linkedin: { type: String, default: '' },
            instagram: { type: String, default: '' },
        },
        logo: {
            type: String,
            default: '',
        },
        favicon: {
            type: String,
            default: '',
        },
        ogImage: {
            type: String,
            default: '',
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

// Ensure only one settings document exists (singleton pattern)
settingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
