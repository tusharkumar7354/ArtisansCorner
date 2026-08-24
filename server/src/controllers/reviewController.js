const reviewService = require(
    "../services/reviewService"
);
const asyncHandler = require(
    "../utils/asyncHandler"
);
const ApiResponse = require(
    "../utils/ApiResponse"
);

// Create Review
const createReview = asyncHandler(
    async (req, res) => {
        const review =
            await reviewService.createReview(
                req.user._id,
                req.body
            );

        return res.status(201).json(
            new ApiResponse(
                201,
                true,
                "Review Added Successfully",
                review
            )
        );
    }
);

// Get Product Reviews
const getProductReviews = asyncHandler(
    async (req, res) => {
        const reviews =
            await reviewService.getProductReviews(
                req.params.productId
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                true,
                "Reviews Fetched Successfully",
                reviews
            )
        );
    }
);

// Update Review
const updateReview = asyncHandler(
    async (req, res) => {
        const review =
            await reviewService.updateReview(
                req.user._id,
                req.params.id,
                req.body
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                true,
                "Review Updated Successfully",
                review
            )
        );
    }
);

// Delete Review
const deleteReview = asyncHandler(
    async (req, res) => {
        const result =
            await reviewService.deleteReview(
                req.user._id,
                req.params.id
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                true,
                "Review Deleted Successfully",
                result
            )
        );
    }
);

module.exports = {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview
};

