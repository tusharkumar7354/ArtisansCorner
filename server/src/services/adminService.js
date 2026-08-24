const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Store = require("../models/Store");
const Cart = require("../models/Cart");
const Review = require("../models/Review");

const ROLES = require("../constants/roles");
const ApiError = require("../utils/ApiError");

// Dashboard statistics
const getDashboardStats = async () => {
    const totalUsers =
        await User.countDocuments();

    const totalProducts =
        await Product.countDocuments();

    const totalOrders =
        await Order.countDocuments();

    const totalStores =
        await Store.countDocuments();

    const paidOrders =
        await Order.countDocuments({
            paymentStatus: "Paid"
        });

    const pendingOrders =
        await Order.countDocuments({
            orderStatus: "Pending"
        });

    const revenueResult =
        await Payment.aggregate([
            {
                $match: {
                    status: "Paid"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$amount"
                    }
                }
            }
        ]);

    const totalRevenue =
        revenueResult.length > 0
            ? revenueResult[0].totalRevenue
            : 0;

    return {
        totalUsers,
        totalProducts,
        totalOrders,
        totalStores,
        paidOrders,
        pendingOrders,
        totalRevenue
    };
};


// Get all users
const getAllUsers = async () => {
    return User.find()
        .select("-password")
        .sort({
            createdAt: -1
        });
};


// Get all sellers
const getAllSellers = async () => {
    const sellers =
        await User.find({
            roles: {
                $in: [ROLES.SELLER],
                $nin: [ROLES.ADMIN]
            }
        })
            .select("-password")
            .sort({
                createdAt: -1
            })
            .lean();

    const sellerIds =
        sellers.map(
            (seller) => seller._id
        );

    const stores =
        await Store.find({
            seller: {
                $in: sellerIds
            }
        })
            .select(
                "seller storeName logo description isActive"
            )
            .lean();

    const storeMap =
        new Map(
            stores.map(
                (store) => [
                    store.seller.toString(),
                    store
                ]
            )
        );

    return sellers.map(
        (seller) => ({
            ...seller,
            store:
                storeMap.get(
                    seller._id.toString()
                ) || null
        })
    );
};


// Get all products
const getAllProducts = async () => {
    return Product.find()
        .populate(
            "seller",
            "name email"
        )
        .populate(
            "store",
            "storeName"
        )
        .populate(
            "category",
            "name"
        )
        .sort({
            createdAt: -1
        });
};


// Get all orders
const getAllOrders = async () => {
    return Order.find()
        .populate(
            "buyer",
            "name email"
        )
        .populate(
            "items.product",
            "title price images"
        )
        .populate(
            "items.seller",
            "name email"
        )
        .sort({
            createdAt: -1
        });
};


// Update order status
const updateOrderStatus = async (
    orderId,
    status
) => {
    const allowedStatuses = [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled"
    ];

    if (
        !allowedStatuses.includes(status)
    ) {
        throw new ApiError(
            400,
            "Invalid order status"
        );
    }

    const order =
        await Order.findById(
            orderId
        );

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    order.orderStatus =
        status;

    await order.save();

    return order;
};


// Toggle user block status
const toggleUserBlockStatus = async (
    userId
) => {
    const user =
        await User.findById(
            userId
        );

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    if (
        user.roles?.includes(
            ROLES.ADMIN
        )
    ) {
        throw new ApiError(
            403,
            "Admin accounts cannot be blocked"
        );
    }

    user.isBlocked =
        !user.isBlocked;

    await user.save();

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        isBlocked: user.isBlocked
    };
};


// Delete user
//
// Important:
// If the user is a seller, this function
// removes only the seller role and seller
// resources. The user account remains.
//
// Example:
//
// ["buyer", "seller"]
//        ↓
// ["buyer"]
//
// A normal buyer without seller role is
// completely deleted.
const deleteUser = async (
    userId
) => {
    const user =
        await User.findById(
            userId
        );

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    // Admin accounts cannot be deleted.
    if (
        user.roles?.includes(
            ROLES.ADMIN
        )
    ) {
        throw new ApiError(
            403,
            "Admin accounts cannot be deleted"
        );
    }

    const isSeller =
        user.roles?.includes(
            ROLES.SELLER
        );

    // --------------------------------------------------
    // SELLER DELETE
    // --------------------------------------------------

    if (isSeller) {
        const products =
            await Product.find({
                seller: userId
            }).select("_id");

        const productIds =
            products.map(
                (product) =>
                    product._id
            );

        // Remove reviews belonging
        // to seller's products.
        if (productIds.length > 0) {
            await Review.deleteMany({
                product: {
                    $in: productIds
                }
            });

            // Remove seller products
            // from users' carts.
            await Cart.updateMany(
                {},
                {
                    $pull: {
                        items: {
                            product: {
                                $in: productIds
                            }
                        }
                    }
                }
            );

            // Delete seller products.
            await Product.deleteMany({
                seller: userId
            });
        }

        // Delete seller store.
        await Store.deleteOne({
            seller: userId
        });

        // Remove only seller role.
        user.roles =
            user.roles.filter(
                (role) =>
                    role !== ROLES.SELLER
            );

        // Every remaining marketplace
        // account should still be a buyer.
        if (
            !user.roles.includes(
                ROLES.BUYER
            )
        ) {
            user.roles.push(
                ROLES.BUYER
            );
        }

        // Seller account is no longer active.
        user.isSeller = false;

        await user.save();

        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            roles: user.roles,
            isSeller: user.isSeller
        };
    }

    // --------------------------------------------------
    // NORMAL USER DELETE
    // --------------------------------------------------

    // Remove reviews written by user.
    await Review.deleteMany({
        user: userId
    });

    // Remove user's cart.
    await Cart.deleteOne({
        user: userId
    });

    // Orders and payments are intentionally
    // preserved as historical records.

    await User.findByIdAndDelete(
        userId
    );

    return {
        _id: user._id,
        name: user.name,
        email: user.email
    };
};


// Toggle product active status
const toggleProductStatus = async (
    productId
) => {
    const product =
        await Product.findById(
            productId
        );

    if (!product) {
        throw new ApiError(
            404,
            "Product not found"
        );
    }

    product.isActive =
        !product.isActive;

    await product.save();

    return product;
};


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