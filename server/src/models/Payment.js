const mongoose = require("mongoose");

const sellerBreakdownSchema = new mongoose.Schema(
    {
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        grossAmount: {
            type: Number,
            required: true,
            min: 0
        },
        platformFee: {
            type: Number,
            required: true,
            min: 0
        },
        vendorPayout: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        _id: false
    }
);

const paymentSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true
        },
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        platformFee: {
            type: Number,
            required: true,
            min: 0
        },
        vendorPayout: {
            type: Number,
            required: true,
            min: 0
        },
        sellerBreakdown: {
            type: [sellerBreakdownSchema],
            default: []
        },
        paymentMethod: {
            type: String,
            default: "Dummy"
        },
        transactionId: {
            type: String,
            required: true,
            unique: true
        },
        status: {
            type: String,
            enum: [
                "Pending",
                "Paid",
                "Failed"
            ],
            default: "Pending"
        },
        paidAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Payment",
    paymentSchema
);



