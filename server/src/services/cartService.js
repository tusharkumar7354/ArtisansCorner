const Cart = require("../models/Cart");
const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");

const addToCart = async (userId, productId, quantity) => {
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
        throw new ApiError(404, "Product not found");
    }
    // Seller cannot purchase their own product
    if (product.seller.toString() === userId.toString()) {
        throw new ApiError(
            400,
            "You cannot purchase your own product"
        );
    }
    if (quantity > product.stock) {
        throw new ApiError(400, "Insufficient stock");
    }
    let cart = await Cart.findOne({
        user: userId
    });
    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: []
        });
    }
    const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
    );
    if (existingItem) {
        const newQuantity =
            existingItem.quantity + quantity;

        if (newQuantity > product.stock) {
            throw new ApiError(400, "Insufficient stock");
        }
        existingItem.quantity = newQuantity;
    } else {
        cart.items.push({
            product: productId,
            quantity
        });
    }
    await cart.save();
    return cart;
};

// Get logged-in user's cart
const getCart = async (userId) => {
    const cart = await Cart.findOne({
        user: userId
    }).populate({
        path: "items.product",
        populate: {
            path: "category",
            select: "name"
        }
    });

    if (!cart) {
        return {
            items: [],
            totalAmount: 0
        };
    }

    // Ignore deleted products while calculating total
    const validItems = cart.items.filter(
        (item) => item.product
    );

    let totalAmount = 0;

    for (const item of validItems) {
        totalAmount +=
            item.product.price * item.quantity;
    }

    return {
        cart,
        totalAmount
    };
};

// Update product quantity in cart
const updateCartItem = async (
    userId,
    productId,
    quantity
) => {
    const cart = await Cart.findOne({
        user: userId
    });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    const item = cart.items.find(
        (cartItem) =>
            cartItem.product.toString() === productId
    );

    if (!item) {
        throw new ApiError(
            404,
            "Product not found in cart"
        );
    }

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
        throw new ApiError(
            400,
            "Product is no longer available"
        );
    }

    // Protect against own-product purchase during cart update
    if (product.seller.toString() === userId.toString()) {
        throw new ApiError(
            400,
            "You cannot purchase your own product"
        );
    }

    if (quantity > product.stock) {
        throw new ApiError(400, "Insufficient stock");
    }

    item.quantity = quantity;

    await cart.save();

    return cart;
};

// Remove product from cart
const removeCartItem = async (
    userId,
    productId
) => {
    const cart = await Cart.findOne({
        user: userId
    });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    const itemIndex = cart.items.findIndex(
        (item) =>
            item.product.toString() === productId
    );

    if (itemIndex === -1) {
        throw new ApiError(
            404,
            "Product not found in cart"
        );
    }

    cart.items.splice(itemIndex, 1);

    await cart.save();

    return cart;
};

// Clear logged-in user's cart
const clearCart = async (userId) => {
    const cart = await Cart.findOne({
        user: userId
    });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    cart.items = [];

    await cart.save();

    return cart;
};

module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart
};