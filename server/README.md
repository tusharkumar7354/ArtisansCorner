# Artisan's Corner Backend

Artisan's Corner is a backend REST API for a handmade products marketplace where users can browse and purchase handmade products, become sellers, manage stores and products, place orders, make payments, and submit product reviews.

The backend supports three main roles:

- Buyer
- Seller
- Admin

A user can have more than one role.

---

## Features

### Authentication

- User Registration
- Email OTP Verification
- User Login
- JWT Authentication
- Password Hashing
- User Profile Management
- Shipping Address Management
- Login Rate Limiting
- Blocked Account Protection

### Buyer

- Browse Products
- Search Products
- Filter Products by Category
- Filter Products by Price
- Sort Products
- Paginated Product Listing
- View Product Details
- Manage Cart
- Add Products to Cart
- Update Cart Quantity
- Remove Cart Items
- Clear Cart
- Update Shipping Address
- Place Orders
- View My Orders
- View Order Details
- Dummy Payment
- Product Reviews and Ratings
- Verified Purchase Reviews

### Seller

- Become a Seller
- Create Store
- View Store
- Update Store
- Upload Store Logo
- Close Store
- Reopen Store
- Create Products
- View Own Products
- Update Own Products
- Delete Own Products
- Manage Product Stock
- Upload Multiple Product Images
- Activate / Deactivate Own Products
- View Seller Orders
- Update Seller Order Status
- View Seller Analytics
- View Sales History
- View Gross Sales
- View Platform Fees
- View Vendor Earnings

### Admin

- Admin Dashboard
- Dashboard Statistics
- Manage Users
- Manage Sellers
- Manage Categories
- Manage Products
- Manage Orders
- Block / Unblock Users
- Activate / Deactivate Products
- Update Administrative Order Status

---

## Technology Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication & Security

- JSON Web Token (JWT)
- bcrypt
- Helmet
- CORS
- Express Rate Limit

### Image Management

- Multer
- Cloudinary
- Streamifier

### Backend Utilities

- dotenv
- Morgan
- Cookie Parser

### Payment

- Dummy Payment Gateway

The current backend uses a Dummy Payment Gateway for development and demonstration purposes.

---

## Project Structure

server/
│
├── node_modules/
├── src/
│ │
│ ├── config/
│ │ ├── DB.js
│ │ └── cloudinary.js
│ │
│ ├── models/
│ │ ├── User.js
│ │ ├── Store.js
│ │ ├── Product.js
│ │ ├── Cart.js
│ │ ├── Category.js
│ │ ├── Order.js
│ │ ├── Payment.js
│ │ ├── EmailVerification.js
│ │ ├── PasswordReset.js
│ │ └── Review.js
│ │
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── sellerController.js
│ │ ├── productController.js
│ │ ├── cartController.js
│ │ ├── categoryController.js
│ │ ├── orderController.js
│ │ ├── paymentController.js
│ │ ├── reviewController.js
│ │ └── adminController.js
│ │
│ ├── services/
│ │ ├── authService.js
│ │ ├── sellerService.js
│ │ ├── productService.js
│ │ ├── cartService.js
│ │ ├── categoryService.js
│ │ ├── orderService.js
│ │ ├── paymentService.js
│ │ ├── reviewService.js
│ │ ├── adminService.js
│ │ ├── emailService.js
│ │ └── cloudinaryService.js
│ │
│ ├── middleware/
│ │ ├── adminMiddleware.js
│ │ ├── authMiddleware.js
│ │ ├── roleMiddleware.js
│ │ ├── uploadMiddleware.js
│ │ ├── errorMiddleware.js
│ │ └── rateLimitMiddleware.js
│ │
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── sellerRoutes.js
│ │ ├── categoryRoutes.js
│ │ ├── productRoutes.js
│ │ ├── cartRoutes.js
│ │ ├── orderRoutes.js
│ │ ├── paymentRoutes.js
│ │ ├── reviewRoutes.js
│ │ └── adminRoutes.js
│ │
│ ├── validators/
│ │ ├── authValidator.js
│ │ ├── cartValidator.js
│ │ ├── sellerValidator.js
│ │ ├── productValidator.js
│ │ └── reviewValidator.js
│ │
│ ├── constants/
│ │ ├── roles.js
│ │ ├── orderStatus.js
│ │ └── paymentStatus.js
│ │
│ ├── scripts/
│ │ ├── cleanupCloudinary.js
│ │
│ ├── utils/
│ │ ├── ApiError.js
│ │ ├── ApiResponse.js
│ │ ├── asyncHandler.js
│ │ └── generateToken.js
│ │
│ ├── docs/
│ │ ├── postman.json
│ │ ├── API.md
│ │ └── ERD.png
│ │
│ ├── app.js
│ └── server.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

---

## Installation

### 1. Clone the Repository

git clone <repository-url>

### 2. Open the Backend Directory

cd server

### 3. Install Dependencies

npm install

---

## Environment Variables

The project uses environment variables for sensitive configuration.

Create a .env file in the root directory.

Configure the required values in .env:

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

CLOUDINARY_API_KEY=your_cloudinary_api_key

CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GOOGLE_EMAIL_SERVICE_URL=your_google_apps_script_web_app_url

GOOGLE_EMAIL_SERVICE_SECRET=your_google_email_service_secret

Never commit the .env file to GitHub.

---

## Email OTP Service

Email OTP delivery uses a Google Apps Script Web App.

The backend sends OTP requests to:

GOOGLE_EMAIL_SERVICE_URL

The Google Apps Script Web App sends the OTP email using the configured Gmail account.

Required environment variables:

GOOGLE_EMAIL_SERVICE_URL=your_google_apps_script_web_app_url

GOOGLE_EMAIL_SERVICE_SECRET=your_google_email_service_secret

The Google Apps Script Web App must be deployed with:

Execute as: Me

Who has access: Anyone

The Web App deployment URL must use the /exec endpoint.

The email service supports:

- Email Verification OTP

- Password Reset OTP

Never commit the Google email service secret to GitHub.

---

## Running the Server

For development:

npm run dev

Or:

npm start

The API will run on:

http://localhost:5000

API base URL:

http://localhost:5000/api

---

## API Modules

The backend contains the following API modules:

/api/auth
/api/seller
/api/category
/api/product
/api/cart
/api/order
/api/payment
/api/review
/api/admin

Detailed endpoint information is available in:

src/docs/API.md

The Postman collection is available in:

src/docs/postman.json

---

## Authentication

Protected APIs use JWT Bearer authentication.

Example:

Authorization: Bearer JWT_TOKEN

After successful registration or login, the generated JWT token can be used to access protected APIs.

Blocked users cannot access protected APIs.

---

## User Roles

The application supports:

Buyer
Seller
Admin

Roles are stored in the user's roles array.

Example:

["buyer"]

A buyer who becomes a seller can have:

["buyer", "seller"]

An administrator can have:

["buyer", "admin"]

A user can have multiple roles at the same time.

---

## Seller Role and Account Status

The User model contains:

roles
isSeller

These fields have different purposes.

### roles

The roles array represents the roles assigned to the user.

Example:

roles = ["buyer", "seller"]

### isSeller

isSeller represents whether the seller account is currently active.

Example:

roles = ["buyer", "seller"]
isSeller = true

When a seller closes the store:

roles = ["buyer", "seller"]
isSeller = false

The Seller role remains assigned so the seller can reopen the store later.

---

## Seller Store Lifecycle

A normal user can become a seller by creating a store.

User
↓
Become Seller
↓
Seller Role Added
↓
isSeller = true
↓
Store Created
↓
Store Active
↓
Create Products

When the seller closes the store:

Store = Inactive
Seller Account = Inactive

When the seller reopens the store:

Store = Active
Seller Account = Active

Products that were active before the store was closed can be restored when the store is reopened.

Products that were already inactive remain inactive.

---

## Seller Store

Each seller can have one Store.

A Store contains:

seller
storeName
logo
description
isActive

The seller field references the User document.

Store logos are uploaded to Cloudinary.

---

## Seller Store Management

Sellers can:

- Create a Store
- View their Dashboard
- Update Store Name
- Update Store Description
- Update Store Logo
- Close Store
- Reopen Store

Store name and description are validated before saving.

---

## Product Management

Sellers can:

- Create Products
- View Own Products
- Update Own Products
- Delete Own Products
- Manage Product Stock
- Upload Multiple Product Images
- Activate Products
- Deactivate Products

Each product references:

seller → User
store → Store
category → Category

A seller can only manage products belonging to their own account.

Products cannot be activated while the seller's store is closed.

---

## Product Search and Filtering

The public product listing supports:

- Search by Product Title
- Category Filtering
- Minimum Price
- Maximum Price
- Newest Sorting
- Price Ascending Sorting
- Price Descending Sorting
- Pagination

Only active products are returned through the public product listing.

Default pagination values:

page = 1
limit = 10

---

## Product Image Upload

Product images are uploaded using Multer and Cloudinary.

The product creation API supports multiple image uploads.

Maximum images per request:

5

Maximum image size:

5 MB per file

Only image files are accepted.

Cloudinary stores the uploaded images while MongoDB stores the associated image information.

Stored image information includes:

public_id
url

When product images are replaced or a product is deleted, the associated Cloudinary images are also handled by the backend.

---

## Cart

Authenticated users can use the cart before placing an order.

The cart contains:

user
items

Each cart item contains:

product
quantity

Cart operations include:

- Add Product
- View Cart
- Update Quantity
- Remove Product
- Clear Cart

---

## Cart Validation

The cart validates:

- Product existence
- Product active status
- Product stock
- Quantity
- Seller ownership

A seller cannot add their own product to their cart.

Cart quantity must be a positive whole number and cannot exceed available stock.

---

## Order Flow

The order lifecycle is:

Buyer Adds Products To Cart
↓
Place Order
↓
paymentStatus = Pending
orderStatus = Pending
↓
Make Payment
↓
Validate Stock Again
↓
Reduce Stock
↓
paymentStatus = Paid
orderStatus = Processing
↓
Clear Cart
↓
Seller
↓
Shipped
↓
Delivered

---

## Order Creation

When an order is placed:

- The cart must not be empty
- Shipping address must exist
- Products must exist
- Products must be active
- Sufficient stock must be available
- A buyer cannot purchase their own product

The buyer's shipping address is copied into the order.

The initial order state is:

paymentStatus = Pending
orderStatus = Pending

---

## Order Status

Supported order statuses are:

Pending
Processing
Shipped
Delivered

### Status Responsibility

Pending → Initial order state
Processing → System after successful payment
Shipped → Seller
Delivered → Seller

---

## Order Items

An order can contain products from multiple sellers.

Each order item stores:

product
seller
quantity
price
status

Order item statuses are:

Processing
Shipped
Delivered

This allows different sellers in the same order to manage their own fulfillment independently.

Example:

Order
├── Seller A Product → Delivered
└── Seller B Product → Shipped

---

## Seller Order Management

Sellers can view orders containing their products.

A seller can update only their own order items.

Normal seller fulfillment flow:

Processing
↓
Shipped
↓
Delivered

A seller:

- Cannot ship an unpaid order
- Cannot update another seller's order items
- Cannot mark an item Delivered before it is Shipped
- Cannot move a Delivered item backward

The overall order status is calculated from its item statuses.

---

## Stock Management

Product stock is validated when an order is placed.

Stock is not reduced when the order is initially created.

Stock is validated again before payment is completed.

Stock is reduced only after successful payment.

Example:

Available Stock = 10

Order Quantity = 2

Successful Payment

Remaining Stock = 8

The stock is not reduced again during the same payment flow.

This prevents double stock reduction.

---

## Cart Clearing

The cart is cleared after successful payment.

The sequence is:

Order Created
↓
Payment Pending
↓
Successful Payment
↓
Stock Reduced
↓
Payment Recorded
↓
Cart Cleared

---

## Payment Status

Supported payment statuses are:

Pending
Paid
Failed
Refunded

The current payment implementation uses:

Pending
Paid
Failed

for Payment records.

---

## Dummy Payment Gateway

The current backend uses a Dummy Payment Gateway for development and demonstration.

Payment request:

{
"orderId": "ORDER_ID"
}

Payment endpoint:

POST /api/payment/pay

Only the buyer who placed the order can make the payment.

A paid order cannot be paid again.

After successful payment:

paymentStatus = Paid
orderStatus = Processing

A dummy transaction ID is generated.

Example:

DUMMY_1752834567890

---

## Platform Commission

The platform commission is:

5%

Example:

Product Amount = $100

Platform Fee = $5

Vendor Payout = $95

For multiple sellers in the same order, the backend calculates commission separately for each seller.

Each seller breakdown contains:

seller
grossAmount
platformFee
vendorPayout

The payment record stores the calculated:

amount
platformFee
vendorPayout
sellerBreakdown

---

## Seller Analytics

Seller analytics are calculated from paid orders.

The seller dashboard provides:

Total Gross Sales
Total Platform Fee
Total Earnings
Total Sales
Total Items Sold
Sales History

Sales history includes information such as:

Order ID
Order Number
Gross Amount
Platform Fee
Earnings
Items Sold
Order Status
Payment Status
Created At

Example:

Gross Sales = $1,000

Platform Fee = $50

Vendor Earnings = $950

---

## Reviews and Ratings

Buyers can submit ratings and reviews for products.

Review information includes:

Product
User
Rating
Comment

Ratings are between:

1 and 5

A user can review a product only once.

The database enforces the unique combination:

User + Product

---

## Verified Purchase Reviews

A buyer can submit a review only after successfully purchasing the product.

The backend checks for a paid order containing the product.

The flow is:

Product Purchased
↓
Payment Successful
↓
Paid Order
↓
Review Allowed

Users cannot review products they have not purchased.

---

## Product Rating Calculation

Whenever a review is created, updated, or deleted, the product rating is recalculated.

The Product model stores:

averageRating
totalReviews

The average rating is stored to one decimal place.

---

## Categories

Categories contain:

name
description

Category names are unique.

All users can view categories.

Admins can:

- Create Categories
- Update Categories
- Delete Categories

A category cannot be deleted while products are using that category.

---

## Admin

The Admin module provides platform-level management.

Admin capabilities include:

- Dashboard Statistics
- User Management
- Seller Management
- Category Management
- Product Management
- Order Management
- User Block / Unblock
- Product Activate / Deactivate
- Administrative Order Status Management

Admin APIs are protected using JWT authentication and Admin role authorization.

---

## Admin Dashboard

The Admin Dashboard provides:

Total Users
Total Stores
Total Products
Total Orders
Paid Orders
Pending Orders
Marketplace Revenue

Marketplace revenue is calculated from paid Payment records.

---

## Admin User Management

Admins can:

- View all users
- Block users
- Unblock users

Admin accounts cannot be blocked through the Admin block operation.

Blocked users cannot log in and cannot access protected APIs.

---

## Admin Seller Management

Admin Seller Management lists users who have the Seller role.

The Seller role is determined from:

roles

not only from:

isSeller

For example:

roles = ["buyer", "admin"]
isSeller = true

is not treated as a Seller by the Admin Seller Management API because the user does not have the Seller role.

A user with:

roles = ["buyer", "seller"]
isSeller = false

can still appear in Seller Management because the Seller role remains assigned even though the seller account is currently inactive.

Seller information includes:

Name
Email
Roles
Store Name
Store Status
Account Status

---

## Admin Product Management

Admins can:

- View all products
- View inactive products
- View seller information
- View store information
- View category information
- Activate Products
- Deactivate Products

---

## Admin Order Management

Admins can:

- View all orders
- View buyer information
- View product information
- View seller information
- View payment status
- View order status
- Update order status

Supported administrative order statuses:

Pending
Processing
Shipped
Delivered
Cancelled

---

## API Endpoints

### Authentication

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/profile
PUT /api/auth/profile
PUT /api/auth/address

### Seller

POST /api/seller/become-seller
GET /api/seller/store
PUT /api/seller/store
PATCH /api/seller/close-store
PATCH /api/seller/reopen-store
GET /api/seller/orders
GET /api/seller/analytics
PATCH /api/seller/order/:orderId/status

### Category

POST /api/category/create
GET /api/category/all
PUT /api/category/:id
DELETE /api/category/:id

### Product

POST /api/product/create
GET /api/product/all
GET /api/product/my-products
GET /api/product/:id
PUT /api/product/update/:id
DELETE /api/product/delete/:id

### Cart

POST /api/cart/add
GET /api/cart/
PUT /api/cart/update/:productId
DELETE /api/cart/remove/:productId
DELETE /api/cart/clear

### Order

POST /api/order/place
GET /api/order/my-orders
GET /api/order/:id

### Payment

POST /api/payment/pay

### Reviews

POST /api/review/create
GET /api/review/product/:productId
PUT /api/review/:id
DELETE /api/review/:id

### Admin

GET /api/admin/dashboard
GET /api/admin/users
GET /api/admin/sellers
GET /api/admin/products
GET /api/admin/orders
PATCH /api/admin/order/:id/status
PATCH /api/admin/user/:id/block
PATCH /api/admin/product/:id/status

---

## API Security

The backend uses multiple security mechanisms.

### JWT Authentication

Protects authenticated APIs.

### Password Hashing

Passwords are securely hashed using bcrypt before storage.

### Role-Based Authorization

Restricts role-specific operations.

### Admin Authorization

Admin APIs require the Admin role.

### Helmet

Adds security-related HTTP headers.

### CORS

Controls communication between frontend and backend.

### Rate Limiting

The backend applies rate limiting to protect the API and sensitive endpoints.

### Request Validation

Incoming request data is validated before business logic is executed.

Validation is applied to:

- Authentication
- Cart
- Seller Store
- Products
- Reviews

### File Validation

Only image files are accepted for image uploads.

### Global Error Handling

Errors are handled centrally through the global error middleware.

---

## Standard API Response

Successful responses follow a common structure.

Example:

{
"statusCode": 200,
"success": true,
"message": "Operation Successful",
"data": {}
}

Error example:

{
"success": false,
"message": "Error message"
}

---

## Database

MongoDB is used as the database with Mongoose ODM.

Documents use MongoDB \_id values for identification.

Relationships between collections are implemented using Mongoose ObjectId references.

These are MongoDB/Mongoose references and not SQL foreign-key constraints.

---

## Main Database Relationships

User
├── Store
├── Cart
├── Orders
├── Payments
└── Reviews

Store
└── Products

Category
└── Products

Product
├── Seller → User
├── Store → Store
└── Category → Category

Order
├── Buyer → User
└── Items
├── Product → Product
└── Seller → User

Payment
├── Order → Order
├── Buyer → User
└── Seller Breakdown → User

Review
├── User → User
└── Product → Product

---

## Main Database Collections

users
stores
categories
products
carts
orders
payments
reviews
emailverifications
passwordresets

---

## Database Diagram

The database relationship diagram is available at:

src/docs/ERD.png

The ERD represents the MongoDB/Mongoose collection relationships using \_id and ObjectId references.

---

## API Documentation

Detailed API information is available in:

src/docs/API.md

The Postman collection is available in:

src/docs/postman.json

The collection is organized into:

Authentication
Seller
Category
Products
Cart
Orders
Payments
Reviews
Admin


---

## Current Payment Implementation

The current project uses a Dummy Payment Gateway .

The current payment implementation supports:

- Payment validation
- Stock validation
- Stock reduction after successful payment
- Cart clearing after successful payment
- Payment record creation
- Platform commission calculation
- Vendor payout calculation
- Multi-seller commission breakdown
- Dummy transaction IDs

---

## Future Enhancements

Possible future improvements include:

- Payment Gateway Integration
- Refund Processing
- Order Tracking
- Wishlist
- Admin can be Seller

---

## Project Purpose

Artisan's Corner is designed as a backend system for a handmade products marketplace.

It demonstrates:

- REST API Development
- Authentication and Authorization
- JWT Authentication
- MongoDB Data Modeling
- Mongoose Relationships
- Multi-Role Marketplace Architecture
- Seller Store Management
- Product Management
- Inventory Management
- Shopping Cart Management
- Order Processing
- Payment Processing
- Platform Commission Calculation
- Seller Earnings Calculation
- Cloudinary Image Management
- Reviews and Ratings
- Verified Purchase Reviews
- Administrative Management
- API Security
- API Documentation

---

## Author

Tushar Kumar
