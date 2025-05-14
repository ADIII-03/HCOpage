const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const DonationDetails = require('../models/DonationDetails');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for QR code image upload
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'hco/qr-codes',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [
            { width: 500, height: 500, crop: 'fit' },
            { quality: 'auto', fetch_format: 'auto' }
        ],
        format: 'png',
        public_id: (req, file) => `qr-${Date.now()}`
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        if (!file.type || !file.type.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Get donation details
router.get('/', async (req, res) => {
    try {
        let donationDetails = await DonationDetails.findOne();
        
        // If no donation details exist, create default
        if (!donationDetails) {
            donationDetails = await DonationDetails.create({});
        }

        res.json({ success: true, data: donationDetails });
    } catch (error) {
        console.error('Error fetching donation details:', error);
        res.status(500).json({ success: false, message: 'Error fetching donation details' });
    }
});

// Update QR code image (admin only)
router.post('/qr', isAuthenticated, isAdmin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image file provided' });
        }

        console.log('Uploaded file details:', req.file);

        // Ensure we have the Cloudinary response
        if (!req.file.path || !req.file.filename) {
            throw new Error('Invalid upload response from Cloudinary');
        }

        let donationDetails = await DonationDetails.findOne();
        if (!donationDetails) {
            donationDetails = new DonationDetails({});
        }

        // Delete old QR code from Cloudinary if it exists
        if (donationDetails.qrPublicId) {
            try {
                await cloudinary.uploader.destroy(`hco/qr-codes/${donationDetails.qrPublicId}`);
            } catch (error) {
                console.error('Error deleting old QR code:', error);
                // Continue with upload even if delete fails
            }
        }

        // Get the secure URL from Cloudinary
        const cloudinaryUrl = req.file.path;
        const publicId = req.file.filename;

        if (!cloudinaryUrl.includes('cloudinary')) {
            throw new Error('Invalid Cloudinary URL received');
        }

        // Update with new QR code URL and public ID
        donationDetails.qrCodeImage = cloudinaryUrl;
        donationDetails.qrPublicId = publicId;
        
        console.log('Saving donation details:', {
            qrCodeImage: donationDetails.qrCodeImage,
            qrPublicId: donationDetails.qrPublicId
        });

        await donationDetails.save();

        res.json({ 
            success: true, 
            data: {
                ...donationDetails.toObject(),
                qrCodeImage: cloudinaryUrl,
                qrPublicId: publicId
            } 
        });
    } catch (error) {
        console.error('Error updating QR code:', error);
        // If upload succeeded but save failed, cleanup the uploaded image
        if (req.file && req.file.filename) {
            try {
                await cloudinary.uploader.destroy(`hco/qr-codes/${req.file.filename}`);
            } catch (cleanupError) {
                console.error('Error cleaning up uploaded image:', cleanupError);
            }
        }
        res.status(500).json({ 
            success: false, 
            message: 'Error updating QR code: ' + error.message,
            details: error.stack
        });
    }
});

// Update donation details (admin only)
router.put('/', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { upiId, accountName, accountNumber, ifscCode, bankName } = req.body;

        let donationDetails = await DonationDetails.findOne();
        if (!donationDetails) {
            donationDetails = new DonationDetails({});
        }

        // Update fields
        donationDetails.upiId = upiId || donationDetails.upiId;
        donationDetails.accountName = accountName || donationDetails.accountName;
        donationDetails.accountNumber = accountNumber || donationDetails.accountNumber;
        donationDetails.ifscCode = ifscCode || donationDetails.ifscCode;
        donationDetails.bankName = bankName || donationDetails.bankName;

        await donationDetails.save();

        res.json({ success: true, data: donationDetails });
    } catch (error) {
        console.error('Error updating donation details:', error);
        res.status(500).json({ success: false, message: 'Error updating donation details' });
    }
});

// Delete QR code image (admin only)
router.delete('/qr/:publicId', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { publicId } = req.params;
        
        // Delete from Cloudinary using the same format as in upload
        await cloudinary.uploader.destroy(`hco/qr-codes/${publicId}`);

        // Update database
        let donationDetails = await DonationDetails.findOne();
        if (donationDetails) {
            donationDetails.qrCodeImage = null;
            donationDetails.qrPublicId = null;
            await donationDetails.save();
        }

        res.json({ success: true, message: 'QR code deleted successfully' });
    } catch (error) {
        console.error('Error deleting QR code:', error);
        res.status(500).json({ success: false, message: 'Error deleting QR code' });
    }
});

module.exports = router; 