const sellerService = require("../services/sellerService");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

// Become Seller and create store
const becomeSeller = asyncHandler(async (req, res) => {
    const store = await sellerService.becomeSeller(
        req.user._id,
        req.body,
        req.file
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            true,
            "Seller Account Created Successfully",
            store
        )
    );
});

// Get logged-in seller store profile
const getStore = asyncHandler(async (req, res) => {
    const store = await sellerService.getStore(
        req.user._id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Store Fetched Successfully",
            store
        )
    );
});

// Update logged-in seller store profile
const updateStore = asyncHandler(async (req, res) => {
    const store = await sellerService.updateStore(
        req.user._id,
        req.body,
        req.file
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Store Updated Successfully",
            store
        )
    );
});

// Close Store
const closeStore = asyncHandler(async (req, res) => {
    const store = await sellerService.closeStore(
        req.user._id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Store Closed Successfully",
            store
        )
    );
});

// Reopen Store
const reopenStore = asyncHandler(async (req, res) => {
    const store = await sellerService.reopenStore(
        req.user._id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Store Reopened Successfully",
            store
        )
    );
});

// Get Seller Orders
const getSellerOrders = asyncHandler(async (req, res) => {
    const orders = await sellerService.getSellerOrders(
        req.user._id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Seller Orders Fetched Successfully",
            orders
        )
    );
});

// Get Seller Analytics
const getSellerAnalytics = asyncHandler(async (req, res) => {
    const analytics = await sellerService.getSellerAnalytics(
        req.user._id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Seller Analytics Fetched Successfully",
            analytics
        )
    );
});

// Update Seller Order Status
const updateSellerOrderStatus = asyncHandler(async (req, res) => {
    const order = await sellerService.updateSellerOrderStatus(
        req.user._id,
        req.params.orderId,
        req.body.status
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Order Status Updated Successfully",
            order
        )
    );
});

module.exports = {
    becomeSeller,
    getStore,
    updateStore,
    closeStore,
    reopenStore,
    getSellerOrders,
    getSellerAnalytics,
    updateSellerOrderStatus
};