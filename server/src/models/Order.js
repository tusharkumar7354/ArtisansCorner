const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: [
            "Processing",
            "Shipped",
            "Delivered"
        ],
        default: "Processing"
    }
}, {
    _id: false
});

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [orderItemSchema],
    shippingAddress: {
        fullName: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        pincode: String,
        country: String
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: [
            "Pending",
            "Paid",
            "Failed",
            "Refunded"
        ],
        default: "Pending"
    },
    orderStatus: {
        type: String,
        enum: [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ],
        default: "Pending"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);