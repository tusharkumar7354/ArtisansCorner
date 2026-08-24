const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        throw new ApiError(401, "Access Denied. Token Missing");
    }
    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
    );
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
        throw new ApiError(404, "User Not Found");
    }
    if (user.isBlocked) {
        throw new ApiError(403, "Your account has been blocked");
    }
    req.user = user;
    next();
});

module.exports = authMiddleware;