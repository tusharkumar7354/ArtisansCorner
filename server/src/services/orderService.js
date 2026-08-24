const Cart = require("../models/Cart");
const Order = require("../models/Order");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const generateOrderNumber = () => {

    return `AC-${Date.now()}`;

};

// Place Order
const placeOrder = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    const cart = await Cart.findOne({
        user: userId
    }).populate("items.product");
    if (!cart || cart.items.length === 0) {
        throw new ApiError(
            400,
            "Cart is empty"
        );
    }
    if (
        !user.shippingAddress ||
        !user.shippingAddress.address
    ) {
        throw new ApiError(
            400,
            "Shipping address not found"
        );
    }

    const orderItems = [];
    let totalAmount = 0;
    // Validate Cart Products
    for (const item of cart.items) {
        const product = item.product;
        if (!product) {
            throw new ApiError(
                404,
                "Product not found"
            );
        }
        /*Seller cannot purchase own product.
        This is also checked while adding to cart,
        but checkout must independently validate it.*/
        if (
            product.seller.toString() ===
            userId.toString()
        ) {
            throw new ApiError(
                400,
                "You cannot purchase your own product"
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
                `Insufficient stock for ${product.title}`
            );
        }

        orderItems.push({
            product: product._id,
            seller: product.seller,
            quantity: item.quantity,
            price: product.price,
            status: "Processing"

        });
        totalAmount +=
            product.price * item.quantity;
    }

    const order = await Order.create({
        orderNumber:
            generateOrderNumber(),
        buyer:
            userId,
        items:
            orderItems,
        shippingAddress:
            user.shippingAddress,
        totalAmount,
        paymentStatus:
            "Pending",
        orderStatus:
            "Pending"
    });
    return order;
};

// Get My Orders

const getMyOrders = async (userId) => {

    return await Order.find({

        buyer: userId

    })

        .populate(
            "items.product",
            "title price images"
        )

        .sort({

            createdAt: -1

        });

};

// Get Single Order

const getOrderById = async (
    orderId,
    userId
) => {

    const order = await Order.findById(
        orderId
    )

        .populate(
            "buyer",
            "name email"
        )

        .populate(
            "items.product",
            "title price images"
        );

    if (!order) {

        throw new ApiError(
            404,
            "Order not found"
        );

    }

    // Buyer can only access own order

    if (
        userId &&
        order.buyer._id.toString() !==
        userId.toString()
    ) {

        throw new ApiError(
            403,
            "Unauthorized to access this order"
        );

    }

    return order;

};

module.exports = {

    placeOrder,

    getMyOrders,

    getOrderById

};