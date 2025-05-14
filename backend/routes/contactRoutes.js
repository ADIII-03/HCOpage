const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../controllers/contactController');

// Contact form submission route
router.post('/send', sendContactEmail);

module.exports = router; 