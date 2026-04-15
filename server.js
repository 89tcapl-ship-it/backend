import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import pageContentRoutes from './routes/pageContentRoutes.js';
import invitationRoutes from './routes/invitationRoutes.js';

// Load environment variables
// Load environment variables (loaded at top)

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
// Normalize frontend URL and allow both with and without trailing slash
const allowedOrigins = [
    (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, ''),
    (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '') + '/'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// Root route - Server Details
app.get('/', (req, res) => {
    const memory = process.memoryUsage();
    res.status(200).json({
        success: true,
        message: '89tcapl Backend Server',
        status: 'AP,India',
        timestamp: new Date().toISOString(),
        details: {
            uptime: Math.floor(process.uptime()) + ' seconds',
            environment: process.env.NODE_ENV || 'development',
            port: PORT,
            frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
            platform: process.platform,
            nodeVersion: process.version,
            memory: {
                rss: Math.round(memory.rss / 1024 / 1024) + ' MB',
                heapTotal: Math.round(memory.heapTotal / 1024 / 1024) + ' MB',
                heapUsed: Math.round(memory.heapUsed / 1024 / 1024) + ' MB',
            },
            configuration: {
                database: 'MongoDB (connected)',
                emailService: process.env.EMAIL_HOST ? 'Configured' : 'Not Configured',
                cloudinary: process.env.CLOUDINARY_URL ? 'Configured' : 'Not Configured',
            }
        }
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// API Routes - Mounted at both root and /api for flexibility
const mountRoutes = (basePath) => {
    app.use(`${basePath}/auth`, authRoutes);
    app.use(`${basePath}/users`, userRoutes);
    app.use(`${basePath}/contact`, contactRoutes);
    app.use(`${basePath}/services`, serviceRoutes);
    app.use(`${basePath}/blog`, blogRoutes);
    app.use(`${basePath}/settings`, settingsRoutes);
    app.use(`${basePath}/upload`, uploadRoutes);
    app.use(`${basePath}/content`, pageContentRoutes);
    app.use(`${basePath}/invitation`, invitationRoutes);
};

mountRoutes('/api');
mountRoutes(''); // Also mount at root level to prevent 404 if /api is missing in frontend config

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════╗
║                                                ║
║   🚀 89tcapl Backend Server Running           ║
║                                                ║
║   Port: ${PORT}                                    ║
║   Environment: ${process.env.NODE_ENV || 'development'}                    ║
║   Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}    ║
║                                                ║
╚════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    // Close server & exit process
    process.exit(1);
});
