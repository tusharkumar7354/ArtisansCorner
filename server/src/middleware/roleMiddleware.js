const ApiError = require("../utils/ApiError");

const roleMiddleware = (...roles) => {
    return (req, res, next) => {
        if (!req.user.roles.some(role => roles.includes(role))) {
            throw new ApiError(
                403,
                "Access Denied"
            );
        }
        next();
    };
};

module.exports = roleMiddleware;