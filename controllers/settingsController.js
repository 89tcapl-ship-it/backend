import Settings from '../models/Settings.js';

/**
 * Get site settings
 * GET /api/settings
 */
export const getSettings = async (req, res) => {
    try {
        const settings = await Settings.getSettings();

        res.status(200).json({
            success: true,
            data: settings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching settings.',
            error: error.message,
        });
    }
};

/**
 * Update site settings
 * PUT /api/settings
 */
export const updateSettings = async (req, res) => {
    try {
        let settings = await Settings.getSettings();

        // Update fields
        Object.keys(req.body).forEach((key) => {
            if (key === 'socialLinks' && typeof req.body[key] === 'object') {
                settings.socialLinks = { ...settings.socialLinks, ...req.body[key] };
            } else {
                settings[key] = req.body[key];
            }
        });

        settings.updatedBy = req.user._id;
        await settings.save();

        res.status(200).json({
            success: true,
            message: 'Settings updated successfully.',
            data: settings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating settings.',
            error: error.message,
        });
    }
};
