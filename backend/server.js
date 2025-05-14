require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const projectRoutes = require('./routes/projectRoutes');
const donationRoutes = require('./routes/donationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Type', 'Authorization']
}));

// Increase payload size limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// MongoDB Connection with retry logic
const connectDB = async (retries = 5) => {
    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Successfully connected to MongoDB!');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        if (retries > 0) {
            console.log(`Retrying connection... (${retries} attempts remaining)`);
            setTimeout(() => connectDB(retries - 1), 5000);
        } else {
            console.error('Failed to connect to MongoDB after multiple attempts');
            process.exit(1);
        }
    }
};

connectDB();

// Routes
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/donation-details', donationRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/gallery', galleryRoutes);
app.use('/api/v1/contact', contactRoutes);

// Basic route for testing
app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    console.error('Stack:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('CORS Origin:', process.env.CORS_ORIGIN || 'http://localhost:5173');
});

// Handle server errors
server.on('error', (error) => {
    console.error('Server error:', error);
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
        process.exit(1);
    }
}); 