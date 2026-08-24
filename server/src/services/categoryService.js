const Category = require("../models/Category");

const Product = require("../models/Product");

const ApiError = require("../utils/ApiError");

// Create Category
const createCategory = async (
    categoryData
) => {
    const {
        name,
        image
    } = categoryData;

    const categoryName =
        name?.trim();

    if (!categoryName) {
        throw new ApiError(
            400,
            "Category name is required"
        );
    }

    const existingCategory =
        await Category.findOne({
            name: categoryName
        });

    if (existingCategory) {
        throw new ApiError(
            400,
            "Category already exists"
        );
    }

    const category =
        await Category.create({
            name: categoryName,
            image
        });

    return category;
};

// Get All Categories
const getAllCategories =
    async () => {
        return await Category.find()
            .sort({
                createdAt: -1
            });
    };

// Update Category
const updateCategory = async (
    categoryId,
    categoryData
) => {
    const categoryName =
        categoryData.name?.trim();

    if (!categoryName) {
        throw new ApiError(
            400,
            "Category name is required"
        );
    }

    const category =
        await Category.findById(
            categoryId
        );

    if (!category) {
        throw new ApiError(
            404,
            "Category not found"
        );
    }

    const duplicate =
        await Category.findOne({
            name: categoryName,
            _id: {
                $ne: categoryId
            }
        });

    if (duplicate) {
        throw new ApiError(
            400,
            "Category already exists"
        );
    }

    category.name =
        categoryName;

    if (
        categoryData.image !==
        undefined
    ) {
        category.image =
            categoryData.image;
    }

    await category.save();

    return category;
};

// Delete Category
const deleteCategory = async (
    categoryId
) => {
    const category =
        await Category.findById(
            categoryId
        );

    if (!category) {
        throw new ApiError(
            404,
            "Category not found"
        );
    }

    const productCount =
        await Product.countDocuments({
            category: categoryId
        });

    if (productCount > 0) {
        throw new ApiError(
            400,
            `Cannot delete this category because ${productCount} product(s) are using it.`
        );
    }

    await Category.findByIdAndDelete(
        categoryId
    );

    return true;
};

module.exports = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
};