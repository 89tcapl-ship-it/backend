import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Settings from './models/Settings.js';
import Service from './models/Service.js';
import PageContent from './models/PageContent.js';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

// Seed Settings
const seedSettings = async () => {
    try {
        const existingSettings = await Settings.findOne();

        if (existingSettings) {
            console.log('⚠️  Settings already exist, skipping...');
            return;
        }

        const settings = await Settings.create({
            siteName: '89T Corporate Advisors',
            siteDescription: 'A compliance-focused corporate advisory firm supporting startups and growing businesses with registration, taxation, and business advisory services.',
            contactEmail: '89tcapl@gmail.com',
            contactPhone: '+91 93988 57595',
            address: 'No.226/400, Sapthagiri Arc, Block No.206,\n2nd Floor, Hoodi, Bangalore - 560048',
            companyInfo: {
                cin: 'U69201KA2025PTC213011',
                incorporationDate: '23 Dec 2025',
                status: 'Active',
            },
            socialLinks: {
                facebook: 'https://facebook.com/89tcapl',
                twitter: 'https://twitter.com/89tcapl',
                linkedin: 'https://linkedin.com/company/89tcapl',
                instagram: 'https://instagram.com/89tcapl',
            },
        });

        console.log('✅ Settings seeded successfully');
    } catch (error) {
        console.error('❌ Error seeding settings:', error);
    }
};

// Seed Services
const seedServices = async () => {
    try {
        const existingServices = await Service.find();

        // We will upsert services to ensure new content is added
        // if (existingServices.length > 0) {
        //     console.log('⚠️  Services already exist, skipping...');
        //     return;
        // }

        await Service.deleteMany({}); // Clear old services to reset with new specific ones
        console.log('🗑️  Cleared existing services to seed fresh data');

        const services = [
            {
                title: 'Company Registration',
                shortDescription: 'Register your business as Pvt Ltd, LLP, or OPC.',
                description: `
# Company Registration Services

Starting a business is a significant milestone, and choosing the right business structure is crucial for your long-term success. At 89T Corporate Advisors, we provide comprehensive support for registering various types of business entities in India.

## Our Registration Services

### Private Limited Company (Pvt Ltd)
Most popular structure for startups and growing businesses.
- **Benefits:** Limited liability, separate legal entity, easy to raise funds.
- **Requirements:** Minimum 2 directors, 2 shareholders.

### Limited Liability Partnership (LLP)
Hybrid structure combining partnership flexibility with limited liability.
- **Benefits:** Lower compliance cost, limited liability protection.
- **Best for:** Professional firms, small businesses.

### One Person Company (OPC)
Perfect for solo entrepreneurs who want limited liability.
- **Benefits:** Single owner control, limited liability.
- **Requirements:** 1 Director/Shareholder (Resident Indian).

### Partnership Firm
Simple structure for small businesses run by partners.
- **Benefits:** Easy to form, minimal compliance.
- **Note:** Unlimited liability for partners.

## Why Choose Us?
- **Expert Guidance:** We help you choose the right structure.
- **Fast Processing:** Digital-first approach for quick incorporation.
- **Post-Registration Support:** We help with PAN, TAN, and Bank Account opening.
                `,
                image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
                features: ['Pvt Ltd Registration', 'LLP Registration', 'OPC Incorporation', 'Partnership Deed Drafting'],
                isActive: true,
                order: 1,
            },
            {
                title: 'MCA Compliance',
                shortDescription: 'Annual filings and ROC compliance management.',
                description: `
# MCA & ROC Compliance

maintaining compliance with the Ministry of Corporate Affairs (MCA) and Registrar of Companies (ROC) is mandatory for all registered companies and LLPs in India. Non-compliance can lead to heavy penalties and disqualification of directors.

## Essential Compliances We Handle

### Annual Filings
- **AOC-4:** Filing of Financial Statements.
- **MGT-7:** Filing of Annual Return.
- **Form 11 & Form 8:** For LLPs.

### Event-Based Compliances
- **Director Changes:** Appointing or resigning directors (DIR-12).
- **Office Address Change:** Shifting registered office (INC-22).
- **Capital Increase:** Increasing Authorized Capital (SH-7).

### KYC Compliances
- **DIR-3 KYC:** Annual KYC for all Director DIN holders.
- **Active Company Tagging:** Form INC-22A.

## Our Process
1. **Document Review:** We verify your records.
2. **Preparation:** We draft necessary resolutions and forms.
3. **Filing:** We upload forms to the MCA portal.
4. **Tracking:** We share the approval status and challans.
                `,
                image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2072&auto=format&fit=crop',
                features: ['Annual Return Filing', 'Director KYC', 'Registered Office Change', 'Share Transfer'],
                isActive: true,
                order: 2,
            },
            {
                title: 'GST Services',
                shortDescription: 'GST registration, return filing, and advisory.',
                description: `
# GST Services

The Goods and Services Tax (GST) is a comprehensive indirect tax on the manufacture, sale, and consumption of goods and services throughout India. We offer end-to-end GST solutions to ensure your business stays compliant.

## Our GST Offerings

### GST Registration
- Application for new GSTIN.
- Voluntary and Mandatory verification.
- Amendment of Core/Non-Core fields.

### Regular Return Filing
- **GSTR-1:** Monthly/Quarterly return of outward supplies.
- **GSTR-3B:** Monthly summary return and tax payment.
- **GSTR-9/9C:** Annual Return and Reconciliation Statement.

### Advisory & Reconciliation
- Input Tax Credit (ITC) reconciliation with GSTR-2B.
- GST Refund application processing.
- Reply to Show Cause Notices (SCN).
- LUT Filing for Exporters.

## Who Needs GST?
- Businesses with turnover above ₹20 Lakhs (Services) or ₹40 Lakhs (Goods).
- E-commerce sellers.
- Inter-state suppliers.
                `,
                image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop',
                features: ['GST Registration', 'Monthly/Quarterly Filings', 'GSTR-9 Annual Return', 'LUT Filing'],
                isActive: true,
                order: 3,
            },
            {
                title: 'Income Tax Filing',
                shortDescription: 'ITR filing for individuals and businesses.',
                description: `
# Income Tax Filing

Filing Income Tax Returns (ITR) is not just a legal obligation but also essential for financial credibility, loan approvals, and visa applications. We provide expert assisted tax filing services.

## Services for Different Taxpayers

### For Individuals (Salaried & Professional)
- **ITR-1 / ITR-4:** Simplified filing for salaried and small professionals.
- **ITR-2 / ITR-3:** For capital gains, house property, and business income.
- Tax planning to maximize deductions under 80C, 80D, etc.

### For Businesses (Corporate Tax)
- **ITR-6:** For Private Limited Companies.
- **ITR-5:** For LLPs and Firms.
- Tax Audit Report filing (Form 3CA/3CB and 3CD).

### TDS Compliance
- Monthly TDS payment value calculation.
- Quarterly TDS Return Filing (24Q, 26Q).
- Generation of Form 16/16A.

## Why File on Time?
1. Avoid penalties and interest.
2. Carry forward losses to future years.
3. Quick refund processing.
                `,
                image: 'https://images.unsplash.com/photo-1586486855514-8c633cc6fd38?q=80&w=2070&auto=format&fit=crop',
                features: ['ITR Filing (Business/Individual)', 'Tax Audit Support', 'TDS Return Filing', 'Tax Planning'],
                isActive: true,
                order: 4,
            },
        ];

        await Service.insertMany(services);
        console.log('✅ Services seeded successfully');
    } catch (error) {
        console.error('❌ Error seeding services:', error);
    }
};

// Seed Page Content
const seedPageContent = async () => {
    try {
        const existingContent = await PageContent.find();

        if (existingContent.length > 0) {
            console.log('⚠️  Page content already exists, skipping...');
            return;
        }

        const pageContents = [
            {
                page: 'home',
                sections: [
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
                        sectionId: 'stats',
                        title: 'Our Track Record',
                        subtitle: 'Numbers that speak for themselves',
                        order: 2,
                        isActive: true,
                    },
                    {
                        sectionId: 'why-choose-us',
                        title: 'Why Choose Us',
                        subtitle: 'Professional Excellence',
                        content: 'Dedicated support for your business compliance needs',
                        order: 3,
                        isActive: true,
                    },
                    {
                        sectionId: 'cta',
                        title: 'Ready to get started?',
                        subtitle: 'Let us handle your compliance while you focus on growth',
                        buttonText: 'Contact Us Today',
                        buttonLink: '/contact',
                        order: 4,
                        isActive: true,
                    },
                ],
            },
            {
                page: 'about',
                sections: [
                    {
                        sectionId: 'intro',
                        title: 'About 89T Corporate Advisors',
                        subtitle: 'Your Compliance Partner',
                        content: 'We are a compliance-focused corporate advisory firm dedicated to supporting startups and growing businesses with registration, taxation, and business advisory services. Our team of experienced professionals ensures that your business stays compliant while you focus on growth.',
                        order: 1,
                        isActive: true,
                    },
                    {
                        sectionId: 'mission',
                        title: 'Our Mission',
                        content: 'To simplify corporate compliance and empower businesses to focus on growth. We believe that compliance should be straightforward, transparent, and accessible to all businesses, regardless of size.',
                        order: 2,
                        isActive: true,
                    },
                    {
                        sectionId: 'values',
                        title: 'Our Values',
                        content: 'Integrity, Excellence, and Client-First Approach. We are committed to providing the highest quality services with complete transparency and dedication to our clients\' success.',
                        order: 3,
                        isActive: true,
                    },
                ],
            },
            {
                page: 'contact',
                sections: [
                    {
                        sectionId: 'header',
                        title: 'Get in Touch',
                        subtitle: 'We\'re here to help',
                        content: 'Have questions about our services? Fill out the form below and our team will get back to you shortly.',
                        order: 1,
                        isActive: true,
                    },
                ],
            },
        ];

        await PageContent.insertMany(pageContents);
        console.log('✅ Page content seeded successfully');
    } catch (error) {
        console.error('❌ Error seeding page content:', error);
    }
};

// Main seed function
const seedDatabase = async () => {
    console.log('🌱 Starting database seeding...\n');

    await connectDB();

    await seedSettings();
    await seedServices();
    await seedPageContent();

    console.log('\n✅ Database seeding completed!');
    console.log('\n📝 Summary:');
    console.log('   - Settings: Site configuration with social links');
    console.log('   - Services: 5 service categories with features');
    console.log('   - Page Content: Home, About, and Contact page sections');
    console.log('\n💡 Next steps:');
    console.log('   1. Start the backend server: npm run dev');
    console.log('   2. Create super admin at: http://localhost:8080/setup');
    console.log('   3. Login and manage content at: http://localhost:8080/admin');

    process.exit(0);
};

// Run seeder
seedDatabase().catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
});
