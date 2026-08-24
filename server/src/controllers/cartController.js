const cartService = require("../services/cartService");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

// Add To Cart
const addToCart = asyncHandler(async (req, res) => {
    const cart = await cartService.addToCart(
        req.user._id,
        req.body.productId,
        req.body.quantity
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Product Added To Cart",
            cart
        )
    );
});

// Get Cart
const getCart = asyncHandler(async (req, res) => {
    const cart = await cartService.getCart(req.user._id);

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Cart Fetched Successfully",
            cart
        )
    );
});

// Update Quantity
const updateCartItem = asyncHandler(async (req, res) => {
    const cart = await cartService.updateCartItem(
        req.user._id,
        req.params.productId,
        req.body.quantity
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Cart Updated Successfully",
            cart
        )
    );
});

// Remove Item
const removeCartItem = asyncHandler(async (req, res) => {
    const cart = await cartService.removeCartItem(
        req.user._id,
        req.params.productId
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Item Removed Successfully",
            cart
        )
    );
});

// Clear Cart
const clearCart = asyncHandler(async (req, res) => {
    await cartService.clearCart(req.user._id);

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Cart Cleared Successfully"
        )
    );
});

module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart
};

