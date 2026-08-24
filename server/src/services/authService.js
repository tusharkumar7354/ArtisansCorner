const bcrypt = require("bcrypt");
const crypto = require("crypto");

const User = require("../models/User");
const EmailVerification = require("../models/EmailVerification");
const PasswordReset = require("../models/PasswordReset");
const generateToken = require("../utils/generateToken");
const ApiError = require("../utils/ApiError");
const {
    sendVerificationOTP,
    sendPasswordResetOTP
} = require("./emailService");

// Generate OTP
const generateOTP = () => {
    return crypto
        .randomInt(100000, 1000000)
        .toString();
};

// Hash OTP
const hashOTP = (otp) => {
    return crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");
};

// Register User
const registerUser = async (userData) => {
    const { name, email, password } = userData;
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
        email: normalizedEmail
    });

    if (existingUser) {
        throw new ApiError(
            400,
            "User already exists"
        );
    }

    await EmailVerification.deleteMany({
        email: normalizedEmail
    });

    const hashedPassword = await bcrypt.hash(
        password,
        10
    );

    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);

    const expiresAt = new Date(
        Date.now() + 2 * 60 * 1000
    );

    await EmailVerification.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        otp: hashedOTP,
        expiresAt
    });

    try {
        await sendVerificationOTP(
            normalizedEmail,
            otp
        );
    } catch (error) {
        await EmailVerification.deleteMany({
            email: normalizedEmail
        });

        throw new ApiError(
            500,
            "Unable to send verification email. Please try again."
        );
    }

    return {
        email: normalizedEmail,
        message: "OTP sent to your email."
    };
};

// Resend Registration OTP
const resendVerificationOTP = async (email) => {
    const normalizedEmail = email.trim().toLowerCase();

    const verification =
        await EmailVerification.findOne({
            email: normalizedEmail
        });

    if (!verification) {
        throw new ApiError(
            400,
            "Registration request not found. Please register again."
        );
    }

    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);

    verification.otp = hashedOTP;
    verification.expiresAt = new Date(
        Date.now() + 2 * 60 * 1000
    );

    await verification.save();

    try {
        await sendVerificationOTP(
            normalizedEmail,
            otp
        );
    } catch (error) {
        throw new ApiError(
            500,
            "Unable to send OTP. Please try again."
        );
    }

    return {
        email: normalizedEmail,
        message: "New OTP sent to your email."
    };
};

// Verify Email
const verifyEmail = async (email, otp) => {
    if (!email || !otp) {
        throw new ApiError(
            400,
            "Email and OTP are required."
        );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const verification =
        await EmailVerification.findOne({
            email: normalizedEmail
        });

    if (!verification) {
        throw new ApiError(
            400,
            "Verification request not found. Please register again."
        );
    }

    if (verification.expiresAt.getTime() < Date.now()) {
        await EmailVerification.deleteOne({
            _id: verification._id
        });

        throw new ApiError(
            400,
            "OTP has expired. Please request a new OTP."
        );
    }

    if (hashOTP(otp) !== verification.otp) {
        throw new ApiError(
            400,
            "Invalid OTP."
        );
    }

    const existingUser = await User.findOne({
        email: normalizedEmail
    });

    if (existingUser) {
        await EmailVerification.deleteOne({
            _id: verification._id
        });

        throw new ApiError(
            400,
            "User already exists."
        );
    }

    const user = await User.create({
        name: verification.name,
        email: verification.email,
        password: verification.password,
        isEmailVerified: true
    });

    await EmailVerification.deleteOne({
        _id: verification._id
    });

    return {
        userId: user._id,
        email: user.email
    };
};

// Send Password Reset OTP
const forgotPassword = async (email) => {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
        email: normalizedEmail
    });

    if (!user) {
        throw new ApiError(
            404,
            "No account found with this email."
        );
    }

    await PasswordReset.deleteMany({
        email: normalizedEmail
    });

    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);

    const expiresAt = new Date(
        Date.now() + 2 * 60 * 1000
    );

    await PasswordReset.create({
        email: normalizedEmail,
        otp: hashedOTP,
        expiresAt
    });

    try {
        await sendPasswordResetOTP(
            normalizedEmail,
            otp
        );
    } catch (error) {
        await PasswordReset.deleteMany({
            email: normalizedEmail
        });

        throw new ApiError(
            500,
            "Unable to send password reset OTP."
        );
    }

    return {
        email: normalizedEmail,
        message: "Password reset OTP sent."
    };
};

// Reset Password
const resetPassword = async (
    email,
    otp,
    newPassword
) => {
    if (!email || !otp || !newPassword) {
        throw new ApiError(
            400,
            "Email, OTP and new password are required."
        );
    }

    if (newPassword.length < 8) {
        throw new ApiError(
            400,
            "Password must be at least 8 characters long."
        );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const resetRequest = await PasswordReset.findOne({
        email: normalizedEmail
    });

    if (!resetRequest) {
        throw new ApiError(
            400,
            "Password reset request not found. Please request a new OTP."
        );
    }

    if (resetRequest.expiresAt.getTime() < Date.now()) {
        await PasswordReset.deleteOne({
            _id: resetRequest._id
        });

        throw new ApiError(
            400,
            "OTP has expired. Please request a new OTP."
        );
    }

    if (hashOTP(otp) !== resetRequest.otp) {
        throw new ApiError(
            400,
            "Invalid OTP."
        );
    }

    const user = await User.findOne({
        email: normalizedEmail
    });

    if (!user) {
        throw new ApiError(
            404,
            "User not found."
        );
    }

    user.password = await bcrypt.hash(
        newPassword,
        10
    );

    await user.save();

    await PasswordReset.deleteOne({
        _id: resetRequest._id
    });

    return {
        email: user.email,
        message: "Password reset successfully."
    };
};

// Login User
const loginUser = async (userData) => {
    const { email, password } = userData;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
        email: normalizedEmail
    });

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    if (user.isBlocked) {
        throw new ApiError(
            403,
            "Your account has been blocked"
        );
    }

    if (user.isEmailVerified === false) {
        throw new ApiError(
            403,
            "Please verify your email before logging in."
        );
    }

    const isPasswordMatch =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!isPasswordMatch) {
        throw new ApiError(
            401,
            "Invalid Password"
        );
    }

    const token = generateToken(user._id);

    return {
        user,
        token
    };
};

// Get Profile
const getProfile = async (userId) => {
    const user = await User.findById(userId)
        .select("-password");

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    return user;
};

// Update Profile
const updateProfile = async (
    userId,
    profileData
) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    user.name =
        profileData.name || user.name;

    user.phone =
        profileData.phone || user.phone;

    await user.save();

    return user;
};

// Update Shipping Address
const updateShippingAddress = async (
    userId,
    addressData
) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    user.shippingAddress = {
        fullName: addressData.fullName,
        phone: addressData.phone,
        address: addressData.address,
        city: addressData.city,
        state: addressData.state,
        pincode: addressData.pincode
    };

    await user.save();

    return user;
};

module.exports = {
    registerUser,
    resendVerificationOTP,
    verifyEmail,
    forgotPassword,
    resetPassword,
    loginUser,
    getProfile,
    updateProfile,
    updateShippingAddress
};