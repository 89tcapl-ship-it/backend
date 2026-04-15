import PageContent from '../models/PageContent.js';

// Get page content
export const getPageContent = async (req, res) => {
    try {
        const { page } = req.params;

        const content = await PageContent.getPageContent(page);

        res.status(200).json({
            success: true,
            data: content,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch page content',
        });
    }
};

// Update page content
export const updatePageContent = async (req, res) => {
    try {
        const { page } = req.params;
        const { sections } = req.body;

        let content = await PageContent.findOne({ page });

        if (!content) {
            content = new PageContent({
                page,
                sections,
                updatedBy: req.user._id,
            });
        } else {
            content.sections = sections;
            content.updatedBy = req.user._id;
        }

        await content.save();

        res.status(200).json({
            success: true,
            message: 'Page content updated successfully',
            data: content,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update page content',
        });
    }
};

// Add new section to page
export const addSection = async (req, res) => {
    try {
        const { page } = req.params;
        const sectionData = req.body;

        const content = await PageContent.findOne({ page });

        if (!content) {
            return res.status(404).json({
                success: false,
                message: 'Page content not found',
            });
        }

        content.sections.push(sectionData);
        content.updatedBy = req.user._id;
        await content.save();

        res.status(200).json({
            success: true,
            message: 'Section added successfully',
            data: content,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to add section',
        });
    }
};

// Update specific section
export const updateSection = async (req, res) => {
    try {
        const { page, sectionId } = req.params;
        const sectionData = req.body;

        const content = await PageContent.findOne({ page });

        if (!content) {
            return res.status(404).json({
                success: false,
                message: 'Page content not found',
            });
        }

        const sectionIndex = content.sections.findIndex(s => s.sectionId === sectionId);

        if (sectionIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Section not found',
            });
        }

        content.sections[sectionIndex] = { ...content.sections[sectionIndex].toObject(), ...sectionData };
        content.updatedBy = req.user._id;
        await content.save();

        res.status(200).json({
            success: true,
            message: 'Section updated successfully',
            data: content,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update section',
        });
    }
};

// Delete section
export const deleteSection = async (req, res) => {
    try {
        const { page, sectionId } = req.params;

        const content = await PageContent.findOne({ page });

        if (!content) {
            return res.status(404).json({
                success: false,
                message: 'Page content not found',
            });
        }

        content.sections = content.sections.filter(s => s.sectionId !== sectionId);
        content.updatedBy = req.user._id;
        await content.save();

        res.status(200).json({
            success: true,
            message: 'Section deleted successfully',
            data: content,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete section',
        });
    }
};
