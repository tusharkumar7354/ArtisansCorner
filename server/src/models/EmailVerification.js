const mongoose = require("mongoose");

const emailVerificationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        otp: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const EmailVerification = mongoose.model(
    "EmailVerification",
    emailVerificationSchema
);

module.exports = EmailVerification;