require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Import routes
const projectRoutes = require('./routes/projectRoutes');
const donationRoutes = require('./routes/donationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// Get CORS origin from environment variable and handle multiple origins
const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173").split(',').map(origin => origin.trim());
console.log('Environment:', process.env.NODE_ENV);
console.log('CORS Origins configured as:', corsOrigins);

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
            console.log('Request with no origin');
            return callback(null, true);
        }
        
        if (corsOrigins.indexOf(origin) !== -1) {
            console.log('Allowed origin:', origin);
            callback(null, true);
        } else {
            console.log('Blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 600 // Cache preflight request for 10 minutes
};

// CORS Configuration for preflight requests
app.options('*', cors(corsOptions));

// Main CORS middleware
app.use(cors(corsOptions));

// Cookie parser middleware before routes
app.use(cookieParser());

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Basic route for testing CORS and server status
app.get('/api/v1/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Server is running',
        environment: process.env.NODE_ENV,
        cors_origins: corsOrigins,
        request_origin: req.get('origin')
    });
});

// Routes
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/donation-details', donationRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/gallery', galleryRoutes);
app.use('/api/v1/contact', contactRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    console.error('Stack:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app; 