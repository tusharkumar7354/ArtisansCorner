const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

const ROLES = require("../constants/roles");

// Create Category
router.post(
    "/create",
    authMiddleware,
    roleMiddleware(ROLES.ADMIN),
    categoryController.createCategory
);

// Get All Categories
router.get(
    "/all",
    categoryController.getAllCategories
);

// Update Category
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(ROLES.ADMIN),
    categoryController.updateCategory
);

// Delete Category
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(ROLES.ADMIN),
    categoryController.deleteCategory
);

module.exports = router;