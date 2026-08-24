const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 1
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    images: [
        {
            public_id: String,
            url: String
        }
    ],
    averageRating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    wasActiveBeforeStoreClose: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;


