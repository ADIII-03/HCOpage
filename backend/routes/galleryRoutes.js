const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const Gallery = require('../models/Gallery');

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
        folder: 'hco-gallery',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [{ width: 1000, height: 600, crop: 'fill' }],
        format: 'png'
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
}).single('image');

// Get all gallery projects
router.get('/projects', async (req, res) => {
    try {
        let projects = await Gallery.find().sort({ createdAt: -1 });
        
        if (!projects.length) {
            const defaultProjects = [
                { title: 'Project Shakti', description: 'Women empowerment drives and awareness workshops.', images: [] },
                { title: 'Workshops', description: 'Interactive educational and hygiene workshops.', images: [] },
                { title: 'Project Taleem', description: 'Free educational programs for underprivileged children.', images: [] },
                { title: 'Project Manavta', description: 'Environmental initiatives and plantation drives.', images: [] },
                { title: 'Project Ehsaas', description: 'Visits to old age homes and orphanages.', images: [] },
                { title: 'Project Ahaar', description: 'Food distribution to those in need.', images: [] },
            ];

            projects = await Gallery.insertMany(defaultProjects);
        }

        res.json({ success: true, projects });
    } catch (error) {
        console.error('Error fetching gallery projects:', error);
        res.status(500).json({ success: false, message: 'Error fetching gallery projects' });
    }
});

// Upload image to a project
router.post('/upload', (req, res) => {
    upload(req, res, async function(err) {
        // Log the initial request
        console.log('Upload request received:', {
            body: req.body,
            headers: req.headers
        });

        // Handle multer/upload errors
        if (err) {
            console.error('Multer/Upload error:', err);
            return res.status(400).json({
                success: false,
                message: err.message || 'Error processing file upload'
            });
        }

        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No image file provided' });
            }

            console.log('File uploaded successfully:', {
                fieldname: req.file.fieldname,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                path: req.file.path,
                size: req.file.size,
                public_id: req.file.public_id,
                secure_url: req.file.secure_url
            });

            const projectIndex = parseInt(req.body.projectIndex);
            console.log('Project Index:', projectIndex);

            if (isNaN(projectIndex)) {
                console.log('Invalid project index:', req.body.projectIndex);
                // If upload succeeded but project index is invalid, cleanup the uploaded image
                if (req.file.public_id) {
                    await cloudinary.uploader.destroy(req.file.public_id);
                }
                return res.status(400).json({ success: false, message: 'Project index is required and must be a number' });
            }

            // Get all projects
            const projects = await Gallery.find().sort({ createdAt: -1 });
            console.log('Found projects:', projects.length);

            if (!projects || projectIndex >= projects.length) {
                console.log('Project not found for index:', projectIndex);
                // If upload succeeded but project not found, cleanup the uploaded image
                if (req.file.public_id) {
                    await cloudinary.uploader.destroy(req.file.public_id);
                }
                return res.status(404).json({ success: false, message: 'Project not found' });
            }

            const project = projects[projectIndex];
            console.log('Selected project:', project.title);

            // Create new image object with Cloudinary response
            const newImage = {
                url: req.file.secure_url,
                public_id: req.file.public_id,
                createdAt: new Date()
            };
            console.log('New image:', newImage);

            // Add image to project and save
            project.images.push(newImage);
            await project.save();
            console.log('Project saved successfully');

            res.json({
                success: true,
                image: newImage
            });

        } catch (error) {
            console.error('Error uploading image:', {
                error: error.message,
                stack: error.stack,
                body: req.body,
                file: req.file
            });
            // If there was an error and the image was uploaded, delete it
            if (req.file && req.file.public_id) {
                try {
                    await cloudinary.uploader.destroy(req.file.public_id);
                } catch (cleanupError) {
                    console.error('Error cleaning up uploaded image:', cleanupError);
                }
            }
            res.status(500).json({
                success: false,
                message: error.message || 'Error uploading image'
            });
        }
    });
});

// Delete image from a project
router.delete('/delete', async (req, res) => {
    try {
        const { projectIndex, public_id } = req.body;

        if (!public_id) {
            return res.status(400).json({
                success: false,
                message: 'Image public_id is required'
            });
        }

        // Get all projects
        const projects = await Gallery.find().sort({ createdAt: -1 });
        if (!projects || projectIndex >= projects.length) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        const project = projects[projectIndex];

        // Delete from Cloudinary
        try {
            await cloudinary.uploader.destroy(public_id);
        } catch (cloudinaryError) {
            console.error('Cloudinary deletion error:', cloudinaryError);
        }

        // Remove image from project
        project.images = project.images.filter(img => img.public_id !== public_id);
        await project.save();

        res.json({
            success: true,
            message: 'Image deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting image'
        });
    }
});

module.exports = router; 