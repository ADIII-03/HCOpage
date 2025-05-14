const mongoose = require('mongoose');

const donationDetailsSchema = new mongoose.Schema({
    upiId: {
        type: String,
        required: true,
        default: 'hco@upi'
    },
    qrCodeImage: {
        type: String,
        default: 'https://placehold.co/200x200'
    },
    qrPublicId: {
        type: String,
        default: null
    },
    accountName: {
        type: String,
        required: true,
        default: 'Humanity Club Organization'
    },
    accountNumber: {
        type: String,
        required: true,
        default: '1234567890'
    },
    ifscCode: {
        type: String,
        required: true,
        default: 'ABCD0123456'
    },
    bankName: {
        type: String,
        required: true,
        default: 'Example Bank'
    }
}, { timestamps: true });

module.exports = mongoose.model('DonationDetails', donationDetailsSchema); 