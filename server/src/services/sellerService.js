const Store = require("../models/Store");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const ApiError = require("../utils/ApiError");
const ROLES = require("../constants/roles");
const { uploadImage } = require("../services/cloudinaryService");

const calculateOrderStatus = (items) => {
    const statuses = items.map(
        (item) => item.status || "Processing"
    );

    if (statuses.length === 0) {
        return "Pending";
    }

    if (
        statuses.every(
            (status) => status === "Delivered"
        )
    ) {
        return "Delivered";
    }

    if (
        statuses.every(
            (status) =>
                status === "Shipped" ||
                status === "Delivered"
        )
    ) {
        return "Shipped";
    }

    return "Processing";
};

// Become Seller and create store profile
const becomeSeller = async (userId, sellerData, file) => {
    const { storeName, description } = sellerData;

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const existingStore = await Store.findOne({
        seller: userId
    });

    if (existingStore) {
        if (!existingStore.isActive) {
            throw new ApiError(
                400,
                "Store already exists but is closed. Please reopen your store."
            );
        }

        if (!user.isSeller) {
            user.isSeller = true;

            if (!user.roles.includes(ROLES.SELLER)) {
                user.roles.push(ROLES.SELLER);
            }

            await user.save();
        }

        throw new ApiError(400, "Store already exists");
    }

    let logo = "";

    if (file) {
        const uploadedLogo = await uploadImage(file.buffer);
        logo = uploadedLogo.url;
    }

    const store = await Store.create({
        seller: userId,
        storeName,
        description,
        logo,
        isActive: true
    });

    // Add Seller role without removing Buyer role
    if (!user.roles.includes(ROLES.SELLER)) {
        user.roles.push(ROLES.SELLER);
    }

    user.isSeller = true;

    await user.save();

    return store;
};

// Get logged-in seller store profile
const getStore = async (userId) => {
    const store = await Store.findOne({
        seller: userId
    }).populate("seller", "name email");

    if (!store) {
        throw new ApiError(404, "Store not found");
    }

    return store;
};

// Update logged-in seller store profile
const updateStore = async (userId, storeData, file) => {
    const store = await Store.findOne({
        seller: userId
    });

    if (!store) {
        throw new ApiError(404, "Store not found");
    }

    if (storeData.storeName !== undefined) {
        store.storeName = storeData.storeName.trim();
    }

    if (storeData.description !== undefined) {
        store.description = storeData.description.trim();
    }

    // Upload new logo when seller selects another image
    if (file) {
        const uploadedLogo = await uploadImage(file.buffer);
        store.logo = uploadedLogo.url;
    }

    await store.save();

    return store;
};

// Close seller store
const closeStore = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const store = await Store.findOne({
        seller: userId
    });

    if (!store) {
        throw new ApiError(404, "Store not found");
    }

    if (!store.isActive) {
        throw new ApiError(400, "Store is already closed");
    }

    // Disable store
    store.isActive = false;
    await store.save();

    // Remove active seller status
    // Seller role is intentionally kept so the user can reopen the store later.
    user.isSeller = false;
    await user.save();

    /*
     * Only products that were ACTIVE before store closure
     * are marked as inactive because of the store closure.
     *
     * wasActiveBeforeStoreClose = true
     * allows reopenStore() to restore only these products.
     */
    await Product.updateMany(
        {
            seller: userId,
            isActive: true
        },
        {
            $set: {
                wasActiveBeforeStoreClose: true,
                isActive: false
            }
        }
    );

    return store;
};

// Reopen previously closed seller store
const reopenStore = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const store = await Store.findOne({
        seller: userId
    });

    if (!store) {
        throw new ApiError(
            404,
            "Store not found. Please become a seller first."
        );
    }

    if (store.isActive) {
        throw new ApiError(400, "Store is already active");
    }

    // Activate store
    store.isActive = true;
    await store.save();

    // Activate seller account
    user.isSeller = true;

    // Ensure Seller role is still available
    // Buyer role remains untouched.
    if (!user.roles.includes(ROLES.SELLER)) {
        user.roles.push(ROLES.SELLER);
    }

    await user.save();

    /*
     * Restore only products that were active BEFORE
     * the store was closed.
     *
     * Products that were already manually inactive
     * remain inactive.
     */
    await Product.updateMany(
        {
            seller: userId,
            wasActiveBeforeStoreClose: true
        },
        {
            $set: {
                isActive: true,
                wasActiveBeforeStoreClose: false
            }
        }
    );

    return store;
};

// Get orders containing logged-in seller products
const getSellerOrders = async (sellerId) => {
    const user = await User.findById(sellerId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!user.isSeller) {
        throw new ApiError(
            403,
            "Active seller account required"
        );
    }

    const orders = await Order.find({
        "items.seller": sellerId
    })
        .populate("buyer", "name email")
        .populate(
            "items.product",
            "title price images"
        )
        .sort({ createdAt: -1 });

    return orders.map((order) => {
        const sellerItems = order.items.filter(
            (item) =>
                item.seller.toString() ===
                sellerId.toString()
        );

        const mergedSellerItems = [];

        for (const item of sellerItems) {
            const existingItem = mergedSellerItems.find(
                (existing) =>
                    existing.product?._id?.toString() ===
                    item.product?._id?.toString()
            );

            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                mergedSellerItems.push({
                    ...item.toObject(),
                    quantity: item.quantity
                });
            }
        }

        const sellerTotal = mergedSellerItems.reduce(
            (total, item) =>
                total +
                Number(item.price) *
                Number(item.quantity),
            0
        );

        const sellerOrderStatus =
            calculateOrderStatus(mergedSellerItems);

        return {
            _id: order._id,
            orderNumber: order.orderNumber,
            buyer: order.buyer,
            items: mergedSellerItems,
            sellerTotal: Number(
                sellerTotal.toFixed(2)
            ),
            paymentStatus: order.paymentStatus,
            orderStatus: order.orderStatus,
            sellerOrderStatus,
            createdAt: order.createdAt
        };
    });
};

// Get sales and earnings for logged-in seller
const getSellerAnalytics = async (sellerId) => {
    const user = await User.findById(sellerId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!user.isSeller) {
        throw new ApiError(
            403,
            "Active seller account required"
        );
    }

    const paidOrders = await Order.find({
        "items.seller": sellerId,
        paymentStatus: "Paid"
    })
        .populate(
            "items.product",
            "title images"
        )
        .sort({ createdAt: -1 });

    let totalGrossSales = 0;
    let totalPlatformFee = 0;
    let totalEarnings = 0;
    let totalSales = 0;
    let totalItemsSold = 0;

    const salesHistory = [];

    for (const order of paidOrders) {
        const sellerItems = order.items.filter(
            (item) =>
                item.seller.toString() ===
                sellerId.toString()
        );

        if (sellerItems.length === 0) {
            continue;
        }

        let sellerOrderQuantity = 0;

        for (const item of sellerItems) {
            sellerOrderQuantity += item.quantity;
        }

        const payment = await Payment.findOne({
            order: order._id,
            status: "Paid",
            "sellerBreakdown.seller": sellerId
        });

        if (!payment) {
            continue;
        }

        const sellerPayment =
            payment.sellerBreakdown.find(
                (item) =>
                    item.seller.toString() ===
                    sellerId.toString()
            );

        if (!sellerPayment) {
            continue;
        }

        totalGrossSales += sellerPayment.grossAmount;
        totalPlatformFee += sellerPayment.platformFee;
        totalEarnings += sellerPayment.vendorPayout;
        totalSales += 1;
        totalItemsSold += sellerOrderQuantity;

        salesHistory.push({
            orderId: order._id,
            orderNumber: order.orderNumber,
            grossAmount: sellerPayment.grossAmount,
            platformFee: sellerPayment.platformFee,
            earnings: sellerPayment.vendorPayout,
            itemsSold: sellerOrderQuantity,
            orderStatus: order.orderStatus,
            paymentStatus: order.paymentStatus,
            createdAt: order.createdAt
        });
    }

    return {
        totalGrossSales: Number(
            totalGrossSales.toFixed(2)
        ),
        totalPlatformFee: Number(
            totalPlatformFee.toFixed(2)
        ),
        totalEarnings: Number(
            totalEarnings.toFixed(2)
        ),
        totalSales,
        totalItemsSold,
        salesHistory
    };
};

// Update seller order status
const updateSellerOrderStatus = async (
    sellerId,
    orderId,
    status
) => {
    const user = await User.findById(sellerId);

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    if (!user.isSeller) {
        throw new ApiError(
            403,
            "Active seller account required"
        );
    }

    const allowedStatuses = [
        "Shipped",
        "Delivered"
    ];

    if (!allowedStatuses.includes(status)) {
        throw new ApiError(
            400,
            "Seller can only update order status to Shipped or Delivered"
        );
    }

    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    const sellerItems = order.items.filter(
        (item) =>
            item.seller.toString() ===
            sellerId.toString()
    );

    if (sellerItems.length === 0) {
        throw new ApiError(
            403,
            "You are not authorized to update this order"
        );
    }

    // Unpaid orders cannot be shipped or delivered.
    if (order.paymentStatus !== "Paid") {
        throw new ApiError(
            400,
            "Order cannot be shipped before payment"
        );
    }

    /*
     * Seller can only update their own products.
     *
     * Processing -> Shipped
     * Shipped -> Delivered
     *
     * Already Delivered items are never moved backwards.
     */

    if (status === "Shipped") {
        const hasProcessingItem = sellerItems.some(
            (item) =>
                (item.status || "Processing") ===
                "Processing"
        );

        if (!hasProcessingItem) {
            throw new ApiError(
                400,
                "Your products are already shipped or delivered"
            );
        }

        sellerItems.forEach((item) => {
            const itemStatus =
                item.status || "Processing";

            if (itemStatus === "Processing") {
                item.status = "Shipped";
            }
        });
    }

    if (status === "Delivered") {
        const hasProcessingItem = sellerItems.some(
            (item) =>
                (item.status || "Processing") ===
                "Processing"
        );

        if (hasProcessingItem) {
            throw new ApiError(
                400,
                "All your products must be shipped before delivery"
            );
        }

        const hasShippedItem = sellerItems.some(
            (item) =>
                (item.status || "Processing") ===
                "Shipped"
        );

        if (!hasShippedItem) {
            throw new ApiError(
                400,
                "Your products are already delivered"
            );
        }

        sellerItems.forEach((item) => {
            const itemStatus =
                item.status || "Processing";

            if (itemStatus === "Shipped") {
                item.status = "Delivered";
            }
        });
    }

    /*
     * Recalculate the overall order status
     * from ALL seller items in the order.
     *
     * This prevents one seller from marking
     * another seller's products as delivered.
     */
    order.orderStatus = calculateOrderStatus(
        order.items
    );

    await order.save();

    const updatedSellerItems = order.items.filter(
        (item) =>
            item.seller.toString() ===
            sellerId.toString()
    );

    return {
        _id: order._id,
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        sellerOrderStatus:
            calculateOrderStatus(
                updatedSellerItems
            ),
        items: updatedSellerItems
    };
};

module.exports = {
    becomeSeller,
    getStore,
    updateStore,
    closeStore,
    reopenStore,
    getSellerOrders,
    getSellerAnalytics,
    updateSellerOrderStatus
};