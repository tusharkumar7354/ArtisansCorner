const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5000,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many login attempts. Please try again later."
    }
});

// Payment Rate Limiter
//
// Payment should not use the relaxed general API limit.
// This prevents repeated payment requests.
const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many payment requests. Please try again later."
    }
});

module.exports = {
    apiLimiter,
    loginLimiter,
    paymentLimiter
};