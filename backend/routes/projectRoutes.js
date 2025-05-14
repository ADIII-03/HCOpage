const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Project = require('../models/Project');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for image upload
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'hco/projects',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [{ width: 1000, height: 600, crop: 'fill' }]
    }
});

const upload = multer({ storage: storage });

// Get all projects
router.get('/', async (req, res) => {
    try {
        // Get all projects
        const allProjects = await Project.find().lean();
        
        // Create a map to store unique projects by title
        const uniqueProjects = new Map();
        
        // Keep only the latest project for each title
        allProjects.forEach(project => {
            if (!uniqueProjects.has(project.title) || 
                project.createdAt > uniqueProjects.get(project.title).createdAt) {
                uniqueProjects.set(project.title, project);
            }
        });

        // Delete duplicate projects from database
        const uniqueProjectIds = Array.from(uniqueProjects.values()).map(p => p._id);
        await Project.deleteMany({ _id: { $nin: uniqueProjectIds } });

        // Convert map to array and sort by title
        const projects = Array.from(uniqueProjects.values())
            .sort((a, b) => a.title.localeCompare(b.title));

        res.json({ success: true, data: projects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ success: false, message: 'Error fetching projects' });
    }
});

// Create a project
router.post('/', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { title, description, image } = req.body;
        const project = new Project({
            title,
            description,
            image: image || 'https://placehold.co/400x300'
        });
        await project.save();
        res.json({ success: true, data: project });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ success: false, message: 'Error creating project' });
    }
});

// Update project image
router.post('/:projectId/image', isAuthenticated, isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { projectId } = req.params;
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image file provided' });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        // Delete old image from Cloudinary if it exists
        if (project.image && project.image.includes('cloudinary')) {
            const publicId = project.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`hco/projects/${publicId}`);
        }

        // Update project with new image URL
        project.image = req.file.path;
        await project.save();

        res.json({ success: true, data: project });
    } catch (error) {
        console.error('Error updating project image:', error);
        res.status(500).json({ success: false, message: 'Error updating project image' });
    }
});

// Update project details
router.put('/:projectId', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { projectId } = req.params;
        const { title, description } = req.body;

        const project = await Project.findByIdAndUpdate(
            projectId,
            { title, description },
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        res.json({ success: true, data: project });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ success: false, message: 'Error updating project' });
    }
});

// Delete a project
router.delete('/:projectId', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        // Delete project image from Cloudinary if it exists
        if (project.image && project.image.includes('cloudinary')) {
            const publicId = project.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`hco/projects/${publicId}`);
        }

        await project.deleteOne();
        res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ success: false, message: 'Error deleting project' });
    }
});

module.exports = router; 