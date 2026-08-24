const ApiError = require("../utils/ApiError");

const EMAIL_REGEX = /^[A-Za-z0-9._-]+@[A-Za-z0-9-]+\.com$/;

const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(
            400,
            "Name, email and password are required"
        );
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
        throw new ApiError(
            400,
            "Please enter a valid email ending with .com, for example user@gmail.com"
        );
    }

    if (password.length < 8) {
        throw new ApiError(
            400,
            "Password must be at least 8 characters long"
        );
    }

    req.body.email = normalizedEmail;

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(
            400,
            "Email and Password are required"
        );
    }

    next();
};

module.exports = {
    validateRegister,
    validateLogin
};