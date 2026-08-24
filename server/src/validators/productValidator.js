const ApiError = require("../utils/ApiError");

// Validate product creation data
const validateProduct = (req, res, next) => {
    const {
        title,
        description,
        price,
        stock,
        category
    } = req.body;

    if (
        !title ||
        !description ||
        price === undefined ||
        stock === undefined ||
        !category
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    // Product price must be greater than zero
    if (
        Number.isNaN(numericPrice) ||
        numericPrice <= 0
    ) {
        throw new ApiError(
            400,
            "Price must be greater than 0"
        );
    }

    // Stock can be zero but cannot be negative
    if (
        Number.isNaN(numericStock) ||
        numericStock < 0
    ) {
        throw new ApiError(
            400,
            "Stock cannot be negative"
        );
    }

    req.body.title = title.trim();
    req.body.description = description.trim();
    req.body.price = numericPrice;
    req.body.stock = numericStock;

    next();
};

// Validate product update data
const validateUpdateProduct = (req, res, next) => {
    const {
        title,
        description,
        price,
        stock,
        category
    } = req.body;

    // At least one field or image must be provided
    if (
        title === undefined &&
        description === undefined &&
        price === undefined &&
        stock === undefined &&
        category === undefined &&
        (!req.files || req.files.length === 0)
    ) {
        throw new ApiError(
            400,
            "At least one product field or image is required"
        );
    }

    if (title !== undefined) {
        if (
            typeof title !== "string" ||
            !title.trim()
        ) {
            throw new ApiError(
                400,
                "Product title is required"
            );
        }

        req.body.title = title.trim();
    }

    if (description !== undefined) {
        if (
            typeof description !== "string" ||
            !description.trim()
        ) {
            throw new ApiError(
                400,
                "Product description is required"
            );
        }

        req.body.description = description.trim();
    }

    if (price !== undefined) {
        const numericPrice = Number(price);

        if (
            Number.isNaN(numericPrice) ||
            numericPrice <= 0
        ) {
            throw new ApiError(
                400,
                "Price must be greater than 0"
            );
        }

        req.body.price = numericPrice;
    }

    if (stock !== undefined) {
        const numericStock = Number(stock);

        if (
            Number.isNaN(numericStock) ||
            numericStock < 0
        ) {
            throw new ApiError(
                400,
                "Stock cannot be negative"
            );
        }

        req.body.stock = numericStock;
    }

    next();
};

module.exports = {
    validateProduct,
    validateUpdateProduct
};