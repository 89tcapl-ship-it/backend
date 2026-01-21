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
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/content', pageContentRoutes);
app.use('/api/invitation', invitationRoutes);

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
