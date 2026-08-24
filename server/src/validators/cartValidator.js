const ApiError = require("../utils/ApiError");

// Validate Add To Cart request
const validateAddToCart = (req, res, next) => {
    const {
        productId,
        quantity
    } = req.body;

    if (!productId) {
        throw new ApiError(
            400,
            "Product ID is required"
        );
    }

    const numericQuantity = Number(quantity);

    // Cart quantity must be a positive whole number
    if (
        quantity === undefined ||
        quantity === null ||
        quantity === "" ||
        Number.isNaN(numericQuantity) ||
        !Number.isInteger(numericQuantity) ||
        numericQuantity < 1
    ) {
        throw new ApiError(
            400,
            "Quantity must be a whole number of at least 1"
        );
    }

    req.body.quantity = numericQuantity;

    next();
};

// Validate cart quantity update
const validateCartQuantity = (req, res, next) => {
    const {
        quantity
    } = req.body;

    const numericQuantity = Number(quantity);

    // Cart quantity must be a positive whole number
    if (
        quantity === undefined ||
        quantity === null ||
        quantity === "" ||
        Number.isNaN(numericQuantity) ||
        !Number.isInteger(numericQuantity) ||
        numericQuantity < 1
    ) {
        throw new ApiError(
            400,
            "Quantity must be a whole number of at least 1"
        );
    }

    req.body.quantity = numericQuantity;

    next();
};

module.exports = {
    validateAddToCart,
    validateCartQuantity
};