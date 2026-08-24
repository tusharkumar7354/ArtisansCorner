const adminService = require("../services/adminService");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

// Dashboard statistics
const getDashboardStats = asyncHandler(async (req, res) => {
    const stats =
        await adminService.getDashboardStats();

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Dashboard Statistics Fetched Successfully",
            stats
        )
    );
});

// All users
const getAllUsers = asyncHandler(async (req, res) => {
    const users =
        await adminService.getAllUsers();

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Users Fetched Successfully",
            users
        )
    );
});

// All sellers
const getAllSellers = asyncHandler(async (req, res) => {
    const sellers =
        await adminService.getAllSellers();

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Sellers Fetched Successfully",
            sellers
        )
    );
});

// All products including inactive products
const getAllProducts = asyncHandler(async (req, res) => {
    const products =
        await adminService.getAllProducts();

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Products Fetched Successfully",
            products
        )
    );
});

// All orders
const getAllOrders = asyncHandler(async (req, res) => {
    const orders =
        await adminService.getAllOrders();

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Orders Fetched Successfully",
            orders
        )
    );
});

// Update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
    const order =
        await adminService.updateOrderStatus(
            req.params.id,
            req.body.status
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Order Status Updated Successfully",
            order
        )
    );
});

// Block or unblock user
const toggleUserBlockStatus = asyncHandler(
    async (req, res) => {
        const user =
            await adminService.toggleUserBlockStatus(
                req.params.id
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                true,
                user.isBlocked
                    ? "User Blocked Successfully"
                    : "User Unblocked Successfully",
                user
            )
        );
    }
);

// Delete user or seller
const deleteUser = asyncHandler(
    async (req, res) => {
        const user =
            await adminService.deleteUser(
                req.params.id
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                true,
                "User Deleted Successfully",
                user
            )
        );
    }
);

// Activate or deactivate product
const toggleProductStatus = asyncHandler(
    async (req, res) => {
        const product =
            await adminService.toggleProductStatus(
                req.params.id
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                true,
                product.isActive
                    ? "Product Activated Successfully"
                    : "Product Deactivated Successfully",
                product
            )
        );
    }
);

module.exports = {
    getDashboardStats,
    getAllUsers,
    getAllSellers,
    getAllProducts,
    getAllOrders,
    updateOrderStatus,
    toggleUserBlockStatus,
    deleteUser,
    toggleProductStatus
};