const Payment = require("../models/Payment");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const ApiError = require("../utils/ApiError");

const PLATFORM_FEE_PERCENTAGE = 5;

// Pay order
const payOrder = async (orderId, userId) => {
    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    // Only the buyer who placed the order can pay
    if (order.buyer.toString() !== userId.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    // Prevent duplicate payment
    if (order.paymentStatus === "Paid") {
        throw new ApiError(
            400,
            "Order already paid"
        );
    }

    // Validate stock before completing payment
    for (const item of order.items) {
        const product = await Product.findById(
            item.product
        );

        if (!product) {
            throw new ApiError(
                404,
                "Product not found"
            );
        }

        if (!product.isActive) {
            throw new ApiError(
                400,
                `${product.title} is unavailable`
            );
        }

        if (product.stock < item.quantity) {
            throw new ApiError(
                400,
                `${product.title} is out of stock`
            );
        }
    }

    // Calculate commission
    const sellerTotals = {};

    for (const item of order.items) {
        const sellerId = item.seller.toString();
        const itemTotal =
            item.price * item.quantity;

        if (!sellerTotals[sellerId]) {
            sellerTotals[sellerId] = 0;
        }

        sellerTotals[sellerId] += itemTotal;
    }

    const sellerBreakdown = [];

    let totalPlatformFee = 0;
    let totalVendorPayout = 0;

    for (const [sellerId, grossAmount] of Object.entries(
        sellerTotals
    )) {
        const platformFee = Number(
            (
                grossAmount *
                (PLATFORM_FEE_PERCENTAGE / 100)
            ).toFixed(2)
        );

        const vendorPayout = Number(
            (grossAmount - platformFee).toFixed(2)
        );

        totalPlatformFee += platformFee;
        totalVendorPayout += vendorPayout;

        sellerBreakdown.push({
            seller: sellerId,
            grossAmount,
            platformFee,
            vendorPayout
        });
    }

    totalPlatformFee = Number(
        totalPlatformFee.toFixed(2)
    );

    totalVendorPayout = Number(
        totalVendorPayout.toFixed(2)
    );

    // Reduce product stock after successful payment
    for (const item of order.items) {
        const product = await Product.findById(
            item.product
        );

        product.stock -= item.quantity;

        await product.save();
    }

    // Update order after successful payment
    order.paymentStatus = "Paid";
    order.orderStatus = "Processing";

    await order.save();

    // Clear buyer cart after successful payment
    const cart = await Cart.findOne({
        user: userId
    });

    if (cart) {
        cart.items = [];

        await cart.save();
    }

    // Record payment and commission details
    const payment = await Payment.create({
        order: order._id,
        buyer: userId,
        amount: order.totalAmount,
        platformFee: totalPlatformFee,
        vendorPayout: totalVendorPayout,
        sellerBreakdown,
        paymentMethod: "Dummy",
        transactionId: `DUMMY_${Date.now()}`,
        status: "Paid",
        paidAt: new Date()
    });

    return payment;
};

module.exports = {
    payOrder
};