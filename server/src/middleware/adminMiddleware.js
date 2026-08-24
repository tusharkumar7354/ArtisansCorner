const ApiError = require("../utils/ApiError");
const ROLES = require("../constants/roles");

const adminMiddleware = (req, res, next) => {
    if (
        !req.user ||
        !req.user.roles ||
        !req.user.roles.includes(ROLES.ADMIN)
    ) {
        return next(
            new ApiError(
                403,
                "Admin access required"
            )
        );
    }

    next();
};

module.exports = adminMiddleware;

