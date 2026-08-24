const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    validateBecomeSeller,
    validateUpdateStore
} = require("../validators/sellerValidator");

// Become seller and create store profile
router.post(
    "/become-seller",
    authMiddleware,
    upload.single("logo"),
    validateBecomeSeller,
    sellerController.becomeSeller
);

// Get logged-in seller store profile
router.get(
    "/store",
    authMiddleware,
    sellerController.getStore
);

// Update logged-in seller store profile
router.put(
    "/store",
    authMiddleware,
    upload.single("logo"),
    validateUpdateStore,
    sellerController.updateStore
);

// Close seller store
router.patch(
    "/close-store",
    authMiddleware,
    sellerController.closeStore
);

// Reopen seller store
router.patch(
    "/reopen-store",
    authMiddleware,
    sellerController.reopenStore
);

// Get orders containing seller products
router.get(
    "/orders",
    authMiddleware,
    sellerController.getSellerOrders
);

// Get seller dashboard analytics
router.get(
    "/analytics",
    authMiddleware,
    sellerController.getSellerAnalytics
);

// Update seller order status
router.patch(
    "/order/:orderId/status",
    authMiddleware,
    sellerController.updateSellerOrderStatus
);

module.exports = router;