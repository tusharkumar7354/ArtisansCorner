const express = require("express");
const { paymentLimiter } = require("../middleware/rateLimitMiddleware");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

// Dummy Payment

router.post(

    "/pay",

    authMiddleware,
    paymentLimiter,
    paymentController.payOrder

);

module.exports = router;