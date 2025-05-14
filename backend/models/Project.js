const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'https://placehold.co/400x300'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema); 