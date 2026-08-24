const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

const { loginLimiter } = require("../middleware/rateLimitMiddleware");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const {
    validateRegister,
    validateLogin
} = require("../validators/authValidator");

// Register
router.post(
    "/register",
    validateRegister,
    authController.registerUser
);

// Resend Registration OTP
router.post(
    "/resend-otp",
    authController.resendVerificationOTP
);

// Verify Email
router.post(
    "/verify-email",
    authController.verifyEmail
);

// Forgot Password
router.post(
    "/forgot-password",
    authController.forgotPassword
);

// Reset Password
router.post(
    "/reset-password",
    authController.resetPassword
);

// Login
router.post(
    "/login",
    loginLimiter,
    validateLogin,
    authController.loginUser
);

// Logout
router.post(
    "/logout",
    authController.logoutUser
);

// Get Profile
router.get(
    "/profile",
    authMiddleware,
    authController.getProfile
);

// Update Profile
router.put(
    "/profile",
    authMiddleware,
    upload.single("profileImage"),
    authController.updateProfile
);

// Update Shipping Address
router.put(
    "/address",
    authMiddleware,
    authController.updateShippingAddress
);

module.exports = router;