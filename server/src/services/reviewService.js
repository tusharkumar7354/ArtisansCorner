const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");
const ApiError = require("../utils/ApiError");

// Update Product Rating
const updateProductRating = async (productId) => {
    const reviews = await Review.find({
        product: productId
    });

    let averageRating = 0;
    if (reviews.length > 0) {
        const totalRating = reviews.reduce(
            (total, review) => {
                return total + review.rating;
            },
            0
        );

        averageRating = Number(
            (
                totalRating / reviews.length
            ).toFixed(1)
        );
    }

    await Product.findByIdAndUpdate(
        productId,
        {
            averageRating,
            totalReviews: reviews.length
        }
    );
};

// Create Review
const createReview = async (
    userId,
    reviewData
) => {
    const {
        productId,
        rating,
        comment
    } = reviewData;

    const product = await Product.findById(
        productId
    );

    if (!product) {
        throw new ApiError(
            404,
            "Product not found"
        );
    }

    // Check whether buyer has purchased and paid
    // for this product.
    const purchasedOrder = await Order.findOne({
        buyer: userId,
        paymentStatus: "Paid",
        "items.product": productId
    });

    if (!purchasedOrder) {
        throw new ApiError(
            403,
            "You can review only purchased products"
        );
    }

    // Check existing review
    const existingReview = await Review.findOne({
        user: userId,
        product: productId
    });

    if (existingReview) {
        throw new ApiError(
            400,
            "You have already reviewed this product"
        );
    }

    const review = await Review.create({
        user: userId,
        product: productId,
        rating,
        comment
    });

    await updateProductRating(productId);

    return review;
};

// Get Product Reviews
const getProductReviews = async (
    productId
) => {
    const product = await Product.findById(
        productId
    );

    if (!product) {
        throw new ApiError(
            404,
            "Product not found"
        );
    }

    return await Review.find({
        product: productId
    })
        .populate(
            "user",
            "name profileImage"
        )
        .sort({
            createdAt: -1
        });
};

// Update Review
const updateReview = async (
    userId,
    reviewId,
    reviewData
) => {
    const review = await Review.findById(
        reviewId
    );

    if (!review) {
        throw new ApiError(
            404,
            "Review not found"
        );
    }

    if (
        review.user.toString() !==
        userId.toString()
    ) {
        throw new ApiError(
            403,
            "Unauthorized to update this review"
        );
    }

    if (reviewData.rating !== undefined) {
        review.rating =
            reviewData.rating;
    }

    if (reviewData.comment !== undefined) {
        review.comment =
            reviewData.comment;
    }

    await review.save();

    await updateProductRating(
        review.product
    );

    return review;
};

// Delete Review
const deleteReview = async (
    userId,
    reviewId
) => {
    const review = await Review.findById(
        reviewId
    );

    if (!review) {
        throw new ApiError(
            404,
            "Review not found"
        );
    }

    if (
        review.user.toString() !==
        userId.toString()
    ) {
        throw new ApiError(
            403,
            "Unauthorized to delete this review"
        );
    }

    const productId = review.product;

    await review.deleteOne();

    await updateProductRating(
        productId
    );

    return {
        reviewId
    };
};

module.exports = {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview
};



