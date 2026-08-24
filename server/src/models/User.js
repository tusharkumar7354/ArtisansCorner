const mongoose = require("mongoose");
const ROLES = require("../constants/roles");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^[A-Za-z0-9._-]+@[A-Za-z0-9-]+\.com$/,
            "Please enter a valid .com email address"
        ]
    },
    isEmailVerified: {
        type: Boolean,
        default: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [{
            type: String,
            enum: [
                ROLES.BUYER,
                ROLES.SELLER,
                ROLES.ADMIN
            ]
        }],
        default: [ROLES.BUYER]
    },
    // phone: {
    //     type: String,
    //     default: ""
    // },
    shippingAddress: {
        fullName: {
            type: String,
            default: ""
        },
        phone: {
            type: String,
            default: ""
        },
        address: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            default: ""
        },
        state: {
            type: String,
            default: ""
        },
        pincode: {
            type: String,
            default: ""
        }
    },
    isSeller: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;



