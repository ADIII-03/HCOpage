require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get admin details
        const email = await question('Enter admin email: ');
        const password = await question('Enter admin password: ');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            console.log('An admin with this email already exists');
            process.exit(1);
        }

        // Create admin user
        const admin = new User({
            email,
            password,
            role: 'admin'
        });

        await admin.save();
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        rl.close();
        await mongoose.connection.close();
        process.exit();
    }
}

createAdmin(); 