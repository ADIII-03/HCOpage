const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    images: [{
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Gallery', gallerySchema); 