const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const orderController = require("../controllers/orderController");

// Place Order
router.post(

    "/place",

    authMiddleware,

    orderController.placeOrder

);

// My Orders
router.get(

    "/my-orders",

    authMiddleware,

    orderController.getMyOrders

);

// Order Details
router.get(

    "/:id",

    authMiddleware,

    orderController.getOrderById

);

module.exports = router;