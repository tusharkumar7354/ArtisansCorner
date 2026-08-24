const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    validateProduct,
    validateUpdateProduct
} = require("../validators/productValidator");

// Create Product
router.post(
    "/create",
    authMiddleware,
    upload.array("images", 5),
    validateProduct,
    productController.createProduct
);

// Get All Products
router.get(
    "/all",
    productController.getAllProducts
);

// Get Seller Products
router.get(
    "/my-products",
    authMiddleware,
    productController.getSellerProducts
);

// Get Single Product
router.get(
    "/:id",
    productController.getProductById
);

// Update Product
router.put(
    "/update/:id",
    authMiddleware,
    upload.array("images", 5),
    validateUpdateProduct,
    productController.updateProduct
);

// Delete Product
router.delete(
    "/delete/:id",
    authMiddleware,
    productController.deleteProduct
);

module.exports = router;