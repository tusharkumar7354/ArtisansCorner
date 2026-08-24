const orderService = require("../services/orderService");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

// Place Order
const placeOrder = asyncHandler(async (req, res) => {
    const order = await orderService.placeOrder(req.user._id);

    return res.status(201).json(
        new ApiResponse(
            201,
            true,
            "Order Placed Successfully",
            order
        )
    );
});

// Get My Orders
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await orderService.getMyOrders(req.user._id);

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Orders Fetched Successfully",
            orders
        )
    );
});

// Get Order Details
const getOrderById = asyncHandler(async (req, res) => {
    const order = await orderService.getOrderById(
        req.params.id,
        req.user._id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Order Details Fetched Successfully",
            order
        )
    );
});

module.exports = {
    placeOrder,
    getMyOrders,
    getOrderById
};




