require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('../models/Project');
const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const defaultProjects = [
    {
        title: "Project Shakti",
        description: "Empowering women through skill development workshops, financial literacy programs, and entrepreneurship training. We conduct regular sessions on self-defense, health awareness, and career guidance to help women become self-reliant and confident leaders in their communities.",
        image: "https://placehold.co/400x300"
    },
    {
        title: "Workshops",
        description: "Interactive educational workshops focusing on personal development, digital literacy, and environmental consciousness. Our expert-led sessions cover topics from basic computer skills to advanced sustainability practices, making learning accessible and engaging for all.",
        image: "https://placehold.co/400x300"
    },
    {
        title: "Project Taleem",
        description: "A comprehensive education initiative providing quality learning opportunities to underprivileged children. We offer free tutoring, educational materials, and mentorship programs to ensure every child has access to the resources they need for academic success.",
        image: "https://placehold.co/400x300"
    },
    {
        title: "Project Manavta",
        description: "Environmental conservation and community development program focusing on tree plantation, waste management, and sustainable living practices. We organize regular clean-up drives and awareness campaigns to promote environmental responsibility.",
        image: "https://placehold.co/400x300"
    },
    {
        title: "Project Ehsaas",
        description: "Supporting elderly care homes and orphanages through regular visits, healthcare assistance, and emotional support programs. We organize cultural activities, medical camps, and recreational events to bring joy and comfort to our elderly and young residents.",
        image: "https://placehold.co/400x300"
    },
    {
        title: "Project Ahaar",
        description: "Addressing food insecurity through sustainable food distribution networks and nutrition awareness programs. We work with local communities to ensure regular meals reach those in need while promoting healthy eating habits and reducing food waste.",
        image: "https://placehold.co/400x300"
    }
];

async function cleanup() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Delete all existing projects and their images
        const existingProjects = await Project.find();
        for (const project of existingProjects) {
            if (project.image && project.image.includes('cloudinary')) {
                const publicId = project.image.split('/').pop().split('.')[0];
                try {
                    await cloudinary.uploader.destroy(`hco/projects/${publicId}`);
                } catch (error) {
                    console.error('Error deleting image from Cloudinary:', error);
                }
            }
        }
        await Project.deleteMany({});
        console.log('Deleted all existing projects');

        // Create new default projects
        const createdProjects = await Project.insertMany(defaultProjects);
        console.log('Created new default projects:', createdProjects.length);

        console.log('Cleanup completed successfully');
    } catch (error) {
        console.error('Error during cleanup:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
}

cleanup(); 