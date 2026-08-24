const categoryService = require("../services/categoryService");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

// Create Category
const createCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.createCategory(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            true,
            "Category Created Successfully",
            category
        )
    );
});


// Get All Categories
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await categoryService.getAllCategories();

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Categories Fetched Successfully",
            categories
        )
    );
});

// Update Category
const updateCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.updateCategory(
        req.params.id,
        req.body
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Category Updated Successfully",
            category
        )
    );
});

// Delete Category
const deleteCategory = asyncHandler(async (req, res) => {
    await categoryService.deleteCategory(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Category Deleted Successfully",
            null
        )
    );
});

module.exports = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
};

