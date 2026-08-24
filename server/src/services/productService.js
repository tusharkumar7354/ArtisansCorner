const Product = require("../models/Product");
const Category = require("../models/Category");
const Store = require("../models/Store");
const ApiError = require("../utils/ApiError");
const {
    uploadImage,
    deleteImages
} = require("./cloudinaryService");

const createProduct = async (userId, productData, files) => {
    const {
        category,
        title,
        description,
        price,
        stock
    } = productData;

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
        throw new ApiError(404, "Category not found");
    }

    const store = await Store.findOne({
        seller: userId
    });

    if (!store) {
        throw new ApiError(404, "Seller store not found");
    }

    if (!store.isActive) {
        throw new ApiError(
            400,
            "Store is closed. Please reopen your store first."
        );
    }

    const images = [];

    if (files && files.length > 0) {
        for (const file of files) {
            const uploadedImage = await uploadImage(file.buffer);
            images.push(uploadedImage);
        }
    }

    const product = await Product.create({
        seller: userId,
        store: store._id,
        category,
        title,
        description,
        price,
        stock,
        images
    });

    return product;
};

const getAllProducts = async (query) => {
    let {
        page = 1,
        limit = 10,
        search = "",
        category,
        minPrice,
        maxPrice,
        sort = "newest"
    } = query;

    page = Number(page);
    limit = Number(limit);

    const filter = {
        isActive: true
    };

    if (search) {
        filter.title = {
            $regex: search,
            $options: "i"
        };
    }

    if (category) {
        filter.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        filter.price = {};

        if (minPrice !== undefined) {
            filter.price.$gte = Number(minPrice);
        }

        if (maxPrice !== undefined) {
            filter.price.$lte = Number(maxPrice);
        }
    }

    let sortOption = {
        createdAt: -1
    };

    if (sort === "price_asc") {
        sortOption = {
            price: 1
        };
    }

    if (sort === "price_desc") {
        sortOption = {
            price: -1
        };
    }

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find(filter)
        .populate("seller", "name email")
        .populate(
            "store",
            "storeName logo description isActive"
        )
        .populate("category", "name")
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);

    return {
        products,
        pagination: {
            totalProducts,
            totalPages,
            currentPage: page,
            limit
        }
    };
};

const getProductById = async (productId) => {
    const product = await Product.findOne({
        _id: productId,
        isActive: true
    })
        .populate("seller", "name email")
        .populate(
            "store",
            "storeName logo description isActive"
        )
        .populate("category", "name");

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return product;
};

const getSellerProducts = async (userId) => {
    return Product.find({
        seller: userId
    })
        .populate("category", "name")
        .populate(
            "store",
            "storeName logo description isActive"
        )
        .sort({ createdAt: -1 });
};

const updateProduct = async (
    userId,
    productId,
    productData,
    files
) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if (product.seller.toString() !== userId.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    if (productData.category !== undefined) {
        const categoryExists = await Category.findById(
            productData.category
        );

        if (!categoryExists) {
            throw new ApiError(404, "Category not found");
        }

        product.category = productData.category;
    }

    if (productData.title !== undefined) {
        product.title = productData.title;
    }

    if (productData.description !== undefined) {
        product.description = productData.description;
    }

    if (productData.price !== undefined) {
        product.price = productData.price;
    }

    if (productData.stock !== undefined) {
        product.stock = productData.stock;
    }

    if (files && files.length > 0) {
        await deleteImages(product.images);

        const uploadedImages = [];

        for (const file of files) {
            const uploadedImage = await uploadImage(file.buffer);
            uploadedImages.push(uploadedImage);
        }

        product.images = uploadedImages;
    }

    await product.save();

    return product;
};

const deleteProduct = async (userId, productId) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if (product.seller.toString() !== userId.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    await deleteImages(product.images);

    await Product.findByIdAndDelete(productId);
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    getSellerProducts,
    updateProduct,
    deleteProduct
};