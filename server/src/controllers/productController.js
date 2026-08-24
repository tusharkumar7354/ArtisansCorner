const productService = require("../services/productService");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

// Create Product
const createProduct = asyncHandler(async (req, res) => {
    const product = await productService.createProduct(
        req.user._id,
        req.body,
        req.files
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            true,
            "Product Created Successfully",
            product
        )
    );
});

// Get All Products
const getAllProducts = asyncHandler(async (req, res) => {
    const result = await productService.getAllProducts(req.query);

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Products Fetched Successfully",
            result
        )
    );
});

// Get Single Product
const getProductById = asyncHandler(async (req, res) => {
    const product = await productService.getProductById(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Product Fetched Successfully",
            product
        )
    );
});

// Get Logged In Seller Products
const getSellerProducts = asyncHandler(async (req, res) => {
    const products = await productService.getSellerProducts(req.user._id);

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Seller Products Fetched Successfully",
            products
        )
    );
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
    const product = await productService.updateProduct(
        req.user._id,
        req.params.id,
        req.body,
        req.files
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Product Updated Successfully",
            product
        )
    );
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
    await productService.deleteProduct(
        req.user._id,
        req.params.id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Product Deleted Successfully"
        )
    );
});

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    getSellerProducts,
    updateProduct,
    deleteProduct
};


