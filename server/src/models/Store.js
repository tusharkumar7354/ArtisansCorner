const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    storeName: {
        type: String,
        required: true,
        trim: true
    },
    logo: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Store = mongoose.model(
    "Store",
    storeSchema
);

module.exports = Store;


