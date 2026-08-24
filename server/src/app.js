// Packages
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// Routes
const authRoutes = require("./routes/authRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Middleware
const errorMiddleware = require(
    "./middleware/errorMiddleware"
);

const {
    apiLimiter
} = require(
    "./middleware/rateLimitMiddleware"
);

// App
const app = express();

app.set("trust proxy", 1);

// Middlewares
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(cookieParser());

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://artisanscorner.netlify.app",
        ],
        credentials: true,
    })
);

app.use(helmet());
app.use(morgan("dev"));

// General API Rate Limiting
app.use(
    "/api",
    apiLimiter
);

// Routes
app.use("/api/auth", authRoutes);
app.use(
    "/api/seller",
    sellerRoutes
);
app.use(
    "/api/category",
    categoryRoutes
);
app.use(
    "/api/product",
    productRoutes
);
app.use(
    "/api/cart",
    cartRoutes
);
app.use(
    "/api/order",
    orderRoutes
);
app.use(
    "/api/payment",
    paymentRoutes
);
app.use(
    "/api/review",
    reviewRoutes
);
app.use(
    "/api/admin",
    adminRoutes
);

// Test Route
// app.get("/", (req, res) => {
//     res.status(200).json({
//         success: true,
//         message: "Welcome to Artisan's Corner API"
//     });
// });

app.get("/", (req, res) => {
    res.send(`
        <h1>Artisan's Corner API</h1>
        <p>Welcome to Artisan's Corner Backend API</p>
    `);
});

// Error Middleware
app.use(errorMiddleware);

// Export
module.exports = app;

