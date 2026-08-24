const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

const {
    validateAddToCart,
    validateCartQuantity
} = require("../validators/cartValidator");

// Add product to cart
router.post(
    "/add",
    authMiddleware,
    validateAddToCart,
    cartController.addToCart
);

// Get logged-in user's cart
router.get(
    "/",
    authMiddleware,
    cartController.getCart
);

// Update cart product quantity
router.put(
    "/update/:productId",
    authMiddleware,
    validateCartQuantity,
    cartController.updateCartItem
);

// Remove product from cart
router.delete(
    "/remove/:productId",
    authMiddleware,
    cartController.removeCartItem
);

// Clear complete cart
router.delete(
    "/clear",
    authMiddleware,
    cartController.clearCart
);

module.exports = router;