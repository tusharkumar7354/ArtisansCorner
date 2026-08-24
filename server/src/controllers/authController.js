const authService = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

// Register
const registerUser = asyncHandler(async (req, res) => {
    const result = await authService.registerUser(
        req.body
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            true,
            "OTP sent to your email",
            result
        )
    );
});

// Resend Verification OTP
const resendVerificationOTP = asyncHandler(
    async (req, res) => {
        const result =
            await authService.resendVerificationOTP(
                req.body.email
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                true,
                "New OTP sent to your email",
                result
            )
        );
    }
);

// Verify Email
const verifyEmail = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const result = await authService.verifyEmail(
        email,
        otp
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Email verified successfully. Account created.",
            result
        )
    );
});

// Forgot Password
const forgotPassword = asyncHandler(
    async (req, res) => {
        const result =
            await authService.forgotPassword(
                req.body.email
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                true,
                "Password reset OTP sent",
                result
            )
        );
    }
);

// Reset Password
const resetPassword = asyncHandler(
    async (req, res) => {
        const {
            email,
            otp,
            newPassword
        } = req.body;

        const result =
            await authService.resetPassword(
                email,
                otp,
                newPassword
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                true,
                "Password reset successfully",
                result
            )
        );
    }
);

// Login
const loginUser = asyncHandler(async (req, res) => {
    const result = await authService.loginUser(
        req.body
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Login Successfully",
            result
        )
    );
});

// Logout
const logoutUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Logout Successfully",
            null
        )
    );
});

// Get Profile
const getProfile = asyncHandler(async (req, res) => {
    const user = await authService.getProfile(
        req.user._id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Profile Fetched Successfully",
            user
        )
    );
});

// Update Profile
const updateProfile = asyncHandler(async (req, res) => {
    const user = await authService.updateProfile(
        req.user._id,
        req.body
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Profile Updated Successfully",
            user
        )
    );
});

// Update Shipping Address
const updateShippingAddress = asyncHandler(
    async (req, res) => {
        const user =
            await authService.updateShippingAddress(
                req.user._id,
                req.body
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                true,
                "Shipping Address Updated Successfully",
                user
            )
        );
    }
);

module.exports = {
    registerUser,
    resendVerificationOTP,
    verifyEmail,
    forgotPassword,
    resetPassword,
    loginUser,
    logoutUser,
    getProfile,
    updateProfile,
    updateShippingAddress
};