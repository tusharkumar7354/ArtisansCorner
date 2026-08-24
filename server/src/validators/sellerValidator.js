const ApiError = require("../utils/ApiError");

// Validate data while creating seller store
const validateBecomeSeller = (req, res, next) => {
    const { storeName, description } = req.body;

    if (!storeName || !description) {
        return next(
            new ApiError(
                400,
                "Store Name and Description are required"
            )
        );
    }

    if (
        typeof storeName !== "string" ||
        storeName.trim().length < 3
    ) {
        return next(
            new ApiError(
                400,
                "Store Name must be at least 3 characters"
            )
        );
    }

    if (
        typeof description !== "string" ||
        description.trim().length < 10
    ) {
        return next(
            new ApiError(
                400,
                "Description must be at least 10 characters"
            )
        );
    }

    req.body.storeName = storeName.trim();
    req.body.description = description.trim();

    next();
};

// Validate data while updating seller store
const validateUpdateStore = (req, res, next) => {
    const { storeName, description } = req.body;

    // At least one store field must be provided
    if (
        storeName === undefined &&
        description === undefined &&
        !req.file
    ) {
        return next(
            new ApiError(
                400,
                "Store Name, Description or Logo is required"
            )
        );
    }

    // Validate store name only when provided
    if (storeName !== undefined) {
        if (
            typeof storeName !== "string" ||
            storeName.trim().length < 3
        ) {
            return next(
                new ApiError(
                    400,
                    "Store Name must be at least 3 characters"
                )
            );
        }

        req.body.storeName = storeName.trim();
    }

    // Validate description only when provided
    if (description !== undefined) {
        if (
            typeof description !== "string" ||
            description.trim().length < 10
        ) {
            return next(
                new ApiError(
                    400,
                    "Description must be at least 10 characters"
                )
            );
        }

        req.body.description = description.trim();
    }

    next();
};

module.exports = {
    validateBecomeSeller,
    validateUpdateStore
};