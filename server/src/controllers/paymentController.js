const paymentService = require("../services/paymentService");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

// Dummy Payment
const payOrder = asyncHandler(async (req, res) => {
    if (!req.body || !req.body.orderId) {
        throw new ApiError(
            400,
            "Order ID is required"
        );
    }

    const { orderId } = req.body;

    const payment = await paymentService.payOrder(
        orderId,
        req.user._id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Payment Successful",
            payment
        )
    );
});

module.exports = {
    payOrder
};

