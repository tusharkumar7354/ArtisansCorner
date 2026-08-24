const express = require("express");
const router = express.Router();
const reviewController = require(
    "../controllers/reviewController"
);
const authMiddleware = require(
    "../middleware/authMiddleware"
);
const {
    validateCreateReview,
    validateUpdateReview
} = require(
    "../validators/reviewValidator"
);

// Create Review
router.post(
    "/create",
    authMiddleware,
    validateCreateReview,
    reviewController.createReview
);

// Get Product Reviews
router.get(
    "/product/:productId",
    reviewController.getProductReviews
);

// Update Review
router.put(
    "/:id",
    authMiddleware,
    validateUpdateReview,
    reviewController.updateReview
);

// Delete Review
router.delete(
    "/:id",
    authMiddleware,
    reviewController.deleteReview
);

module.exports = router;




