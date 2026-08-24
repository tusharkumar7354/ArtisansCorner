const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Every admin API requires authentication
// and admin role
router.use(
    authMiddleware,
    adminMiddleware
);

// Dashboard
router.get(
    "/dashboard",
    adminController.getDashboardStats
);

// All users
router.get(
    "/users",
    adminController.getAllUsers
);

// All sellers
router.get(
    "/sellers",
    adminController.getAllSellers
);

// All products
router.get(
    "/products",
    adminController.getAllProducts
);

// All orders
router.get(
    "/orders",
    adminController.getAllOrders
);

// Update order status
router.patch(
    "/order/:id/status",
    adminController.updateOrderStatus
);

// Block or unblock user
router.patch(
    "/user/:id/block",
    adminController.toggleUserBlockStatus
);

// Delete user or seller
router.delete(
    "/user/:id",
    adminController.deleteUser
);

// Activate or deactivate product
router.patch(
    "/product/:id/status",
    adminController.toggleProductStatus
);

module.exports = router;