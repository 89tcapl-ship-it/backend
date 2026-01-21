import Service from '../models/Service.js';

/**
 * Get all services
 * GET /api/services
 */
export const getAllServices = async (req, res) => {
    try {
        const { isActive } = req.query;

        const query = {};
        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        const services = await Service.find(query).sort({ order: 1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: services.length,
            data: services,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching services.',
            error: error.message,
        });
    }
};

/**
 * Get single service
 * GET /api/services/:slug
 */
export const getService = async (req, res) => {
    try {
        const { slug } = req.params;

        const service = await Service.findOne({ slug });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found.',
            });
        }

        res.status(200).json({
            success: true,
            data: service,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching service.',
            error: error.message,
        });
    }
};

/**
 * Create service
 * POST /api/services
 */
export const createService = async (req, res) => {
    try {
        const service = await Service.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Service created successfully.',
            data: service,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Service with this slug already exists.',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error creating service.',
            error: error.message,
        });
    }
};

/**
 * Update service
 * PUT /api/services/:id
 */
export const updateService = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Service updated successfully.',
            data: service,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Service with this slug already exists.',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error updating service.',
            error: error.message,
        });
    }
};

/**
 * Delete service
 * DELETE /api/services/:id
 */
export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findByIdAndDelete(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Service deleted successfully.',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting service.',
            error: error.message,
        });
    }
};
