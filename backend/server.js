require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

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