const express = require('express');
const router = express.Router();
const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');
const FounderMessage = require('../models/FounderMessage');
const { isAdmin } = require('../middleware/auth');

// Get founder message
router.get('/', async (req, res) => {
    try {
        let message = await FounderMessage.findOne();
        if (!message) {
            message = await FounderMessage.create({
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
                message: "At Humanity Club Organization, we believe in the power of small acts of kindness to create big impacts.",
                name: "Saba Sheikh",
                title: "Founder & CEO"
            });
        }
        res.json({ success: true, data: message });
    } catch (error) {
        console.error('Error fetching founder message:', error);
        res.status(500).json({ success: false, message: 'Error fetching founder message' });
    }
});

// Update founder message
router.put('/', isAdmin, async (req, res) => {
    try {
        const { message, name, title } = req.body;
        let founderMessage = await FounderMessage.findOne();
        
        if (!founderMessage) {
            founderMessage = new FounderMessage({
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
                message,
                name,
                title
            });
        } else {
            founderMessage.message = message;
            founderMessage.name = name;
            founderMessage.title = title;
        }
        
        await founderMessage.save();
        res.json({ success: true, data: founderMessage });
    } catch (error) {
        console.error('Error updating founder message:', error);
        res.status(500).json({ success: false, message: 'Error updating founder message' });
    }
});

// Update founder image
router.post('/image', isAdmin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image provided' });
        }

        // Upload to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'founder',
            width: 300,
            crop: "scale"
        });

        let founderMessage = await FounderMessage.findOne();
        if (!founderMessage) {
            founderMessage = new FounderMessage({
                image: result.secure_url,
                message: "At Humanity Club Organization, we believe in the power of small acts of kindness to create big impacts.",
                name: "Saba Sheikh",
                title: "Founder & CEO"
            });
        } else {
            // If there's an existing image, delete it from cloudinary
            if (founderMessage.image && founderMessage.image.includes('cloudinary')) {
                const publicId = founderMessage.image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy('founder/' + publicId);
            }
            founderMessage.image = result.secure_url;
        }

        await founderMessage.save();
        res.json({ success: true, data: founderMessage });
    } catch (error) {
        console.error('Error uploading founder image:', error);
        res.status(500).json({ success: false, message: 'Error uploading founder image' });
    }
});

module.exports = router; 