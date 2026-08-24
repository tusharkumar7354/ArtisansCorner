# Artisan's Corner API Documentation

## Overview

Artisan's Corner is a handmade products marketplace backend API built using Node.js, Express.js, MongoDB, Mongoose, JWT, Multer, and Cloudinary.

The platform supports three main roles:

- Buyer
- Seller
- Admin

# Base URL

http://localhost:5000/api


# 1. Authentication APIs

## Register User

**Method:** POST

**Endpoint:**

/auth/register

**Authentication:** Not Required

**Request Body:**

{
    "name": "Test User",
    "email": "test@example.com",
    "password": "12345678"
}

**Description:**

Creates a new user account.

Password must contain at least 8 characters.


## Login User

**Method:** POST

**Endpoint:**

/auth/login

**Authentication:** Not Required

**Request Body:**

{
    "email": "test@example.com",
    "password": "12345678"
}

**Description:**

Authenticates the user and returns a JWT access token.

Blocked users cannot log in.


## Logout User

**Method:** POST

**Endpoint:**

/auth/logout

**Authentication:** Not Required

**Description:**

Handles user logout.


## Get Profile

**Method:** GET

**Endpoint:**

/auth/profile

**Authentication:** Required

**Header:**

Authorization: Bearer TOKEN

**Description:**

Returns the authenticated user's profile.


## Update Profile

**Method:** PUT

**Endpoint:**

/auth/profile

**Authentication:** Required

**Request Body:**

{
    "name": "Updated User",
    "phone": "9876543210"
}

**Description:**

Updates authenticated user's profile information.


## Update Shipping Address

**Method:** PUT

**Endpoint:**

/auth/address

**Authentication:** Required

**Request Body:**

{
    "fullName": "Test User",
    "phone": "9876543210",
    "address": "123 Main Street",
    "city": "Delhi",
    "state": "Delhi",
    "pincode": "110001"
}

**Description:**

Updates the shipping address used while placing orders.


# 2. Seller APIs

## Become Seller

**Method:** POST

**Endpoint:**

/seller/become-seller

**Authentication:** Required

**Content-Type:**

multipart/form-data

**Fields:**

storeName

description

logo

**Description:**

Converts an authenticated user into a seller and creates a seller store.

The Seller role is added without removing the Buyer role.

Maximum logo size:

5 MB


## Get Seller Store

**Method:** GET

**Endpoint:**

/seller/store

**Authentication:** Required

**Description:**

Returns the authenticated seller's store information.


## Update Seller Store

**Method:** PUT

**Endpoint:**

/seller/store

**Authentication:** Required

**Content-Type:**

multipart/form-data

**Fields:**

storeName

description

logo

**Description:**

Updates seller store information.

Maximum logo size:

5 MB.


## Close Store

**Method:** PATCH

**Endpoint:**

/seller/close-store

**Authentication:** Required

**Role:** Seller

**Description:**

Closes the seller's store and deactivates the seller's active products.

The Seller role remains associated with the user.


## Reopen Store

**Method:** PATCH

**Endpoint:**

/seller/reopen-store

**Authentication:** Required

**Description:**

Reopens an existing seller store.

Products that were active before the store was closed can be restored.


## Get Seller Orders

**Method:** GET

**Endpoint:**

/seller/orders

**Authentication:** Required

**Role:** Seller

**Description:**

Returns orders containing products belonging to the authenticated seller.


## Get Seller Analytics

**Method:** GET

**Endpoint:**

/seller/analytics

**Authentication:** Required

**Role:** Seller

**Description:**

Returns seller sales analytics including:

- Gross sales
- Platform fee
- Seller earnings
- Total sales
- Total items sold
- Sales history


## Update Seller Order Status

**Method:** PATCH

**Endpoint:**

/seller/order/:orderId/status

**Authentication:** Required

**Role:** Seller

**Request Body:**

{
    "status": "Shipped"
}

Supported seller statuses:

- Shipped
- Delivered

Order status flow:

Processing → Shipped → Delivered


# 3. Category APIs

## Create Category

**Method:** POST

**Endpoint:**

/category/create

**Authentication:** Required

**Role:** Admin

**Request Body:**

{
    "name": "Home Decor",
    "description": "Handmade decorative products"
}

**Description:**

Creates a new product category.


## Get All Categories

**Method:** GET

**Endpoint:**

/category/all

**Authentication:** Not Required

**Description:**

Returns all available product categories.


## Update Category

**Method:** PUT

**Endpoint:**

/category/:id

**Authentication:** Required

**Role:** Admin

**Request Body:**

{
    "name": "Home Decor",
    "description": "Updated description"
}

**Description:**

Updates an existing product category.


## Delete Category

**Method:** DELETE

**Endpoint:**

/category/:id

**Authentication:** Required

**Role:** Admin

**Description:**

Deletes an existing category.

A category cannot be deleted while products are using that category.


# 4. Product APIs

## Create Product

**Method:** POST

**Endpoint:**

/product/create

**Authentication:** Required

**Role:** Seller

**Content-Type:**

multipart/form-data

**Fields:**

title

description

price

stock

category

images

Maximum images:

5

Maximum image size:

5 MB per image

**Description:**

Creates a handmade product and uploads product images to Cloudinary.

The seller must have an active store.


## Get All Products

**Method:** GET

**Endpoint:**

/product/all

**Authentication:** Not Required

**Query Parameters:**

page

limit

search

category

minPrice

maxPrice

sort

**Example:**

/product/all?page=1&limit=10

**Default pagination:**

page = 1

limit = 10

**Supported sorting:**

newest

price_asc

price_desc

**Description:**

Returns active products with seller, store, and category information.


## Get Single Product

**Method:** GET

**Endpoint:**

/product/:id

**Authentication:** Not Required

**Description:**

Returns details of a single active product.


## Get My Products

**Method:** GET

**Endpoint:**

/product/my-products

**Authentication:** Required

**Role:** Seller

**Description:**

Returns products belonging to the authenticated seller.


## Update Product

**Method:** PUT

**Endpoint:**

/product/update/:id

**Authentication:** Required

**Role:** Seller

**Content-Type:**

multipart/form-data

**Fields:**

title

description

price

stock

category

images

**Description:**

Updates a product belonging to the authenticated seller.

A seller cannot update another seller's product.

New images replace the existing product images.


## Delete Product

**Method:** DELETE

**Endpoint:**

/product/delete/:id

**Authentication:** Required

**Role:** Seller

**Description:**

Deletes a product belonging to the authenticated seller.

Associated Cloudinary images are also removed.


# 5. Cart APIs

Cart APIs require authentication.

## Add Product To Cart

**Method:** POST

**Endpoint:**

/cart/add

**Authentication:** Required

**Request Body:**

{
    "productId": "PRODUCT_ID",
    "quantity": 2
}

**Description:**

Adds a product to the authenticated user's cart.

The product must be active and available in the requested quantity.

A seller cannot add their own product to their cart.


## Get Cart

**Method:** GET

**Endpoint:**

/cart/

**Authentication:** Required

**Description:**

Returns the authenticated user's cart and cart total.


## Update Cart Quantity

**Method:** PUT

**Endpoint:**

/cart/update/:productId

**Authentication:** Required

**Request Body:**

{
    "quantity": 3
}

**Description:**

Updates the quantity of a product in the cart.


## Remove Product From Cart

**Method:** DELETE

**Endpoint:**

/cart/remove/:productId

**Authentication:** Required

**Description:**

Removes a product from the authenticated user's cart.


## Clear Cart

**Method:** DELETE

**Endpoint:**

/cart/clear

**Authentication:** Required

**Description:**

Clears all products from the authenticated user's cart.


# 6. Order APIs

## Place Order

**Method:** POST

**Endpoint:**

/order/place

**Authentication:** Required

**Description:**

Creates an order using products currently present in the buyer's cart.

The shipping address is copied from the buyer profile.

Initial payment status:

paymentStatus = Pending

Initial order status:

orderStatus = Pending

Product stock is reduced after successful payment.

The cart is cleared after successful payment.


## Get My Orders

**Method:** GET

**Endpoint:**

/order/my-orders

**Authentication:** Required

**Description:**

Returns orders belonging to the authenticated buyer.


## Get Order Details

**Method:** GET

**Endpoint:**

/order/:id

**Authentication:** Required

**Description:**

Returns details of a specific order.


# 7. Payment API

## Dummy Payment

**Method:** POST

**Endpoint:**

/payment/pay

**Authentication:** Required

**Request Body:**

{
    "orderId": "ORDER_ID"
}

**Description:**

Processes a simulated payment for development and demonstration purposes.

After successful payment:

paymentStatus = Paid

orderStatus = Processing

Product stock is reduced after successful payment.

The cart is cleared after successful payment.

A dummy transaction ID is generated.

Example:

DUMMY_1752834567890

Platform commission:

5%

Example:

Product Amount = 100

Platform Fee = 5

Vendor Payout = 95


# 8. Review APIs

## Create Review

**Method:** POST

**Endpoint:**

/review/create

**Authentication:** Required

**Request Body:**

{
    "productId": "PRODUCT_ID",
    "rating": 5,
    "comment": "Excellent handmade product"
}

**Description:**

Creates a product review.

The user must have purchased the product through a paid order.

A user can review a product only once.

Rating must be between 1 and 5.


## Get Product Reviews

**Method:** GET

**Endpoint:**

/review/product/:productId

**Authentication:** Not Required

**Description:**

Returns reviews associated with a product.


## Update Review

**Method:** PUT

**Endpoint:**

/review/:id

**Authentication:** Required

**Request Body:**

{
    "rating": 4,
    "comment": "Updated review"
}

**Description:**

Allows the review owner to update their review.


## Delete Review

**Method:** DELETE

**Endpoint:**

/review/:id

**Authentication:** Required

**Description:**

Allows the review owner to delete their review.


# 9. Admin APIs

Admin APIs provide platform-level management capabilities.

**Authentication:** Required

**Role:** Admin


## Admin Dashboard

**Method:** GET

**Endpoint:**

/admin/dashboard

**Authentication:** Required

**Role:** Admin

**Description:**

Returns dashboard statistics including:

- Total users
- Total products
- Total orders
- Total stores
- Paid orders
- Pending orders
- Total revenue


## Get All Users

**Method:** GET

**Endpoint:**

/admin/users

**Authentication:** Required

**Role:** Admin

**Description:**

Returns all users without password information.


## Get All Sellers

**Method:** GET

**Endpoint:**

/admin/sellers

**Authentication:** Required

**Role:** Admin

**Description:**

Returns users having the Seller role along with their store information.


## Get All Products

**Method:** GET

**Endpoint:**

/admin/products

**Authentication:** Required

**Role:** Admin

**Description:**

Returns all products including inactive products.

Seller, store, and category information is included.


## Get All Orders

**Method:** GET

**Endpoint:**

/admin/orders

**Authentication:** Required

**Role:** Admin

**Description:**

Returns all marketplace orders.


## Update Order Status

**Method:** PATCH

**Endpoint:**

/admin/order/:id/status

**Authentication:** Required

**Role:** Admin

**Request Body:**

{
    "status": "Processing"
}

Supported statuses:

- Pending
- Processing
- Shipped
- Delivered
- Cancelled

**Description:**

Allows an administrator to update the overall order status.


## Block / Unblock User

**Method:** PATCH

**Endpoint:**

/admin/user/:id/block

**Authentication:** Required

**Role:** Admin

**Description:**

Blocks or unblocks a user.

Admin accounts cannot be blocked.


## Activate / Deactivate Product

**Method:** PATCH

**Endpoint:**

/admin/product/:id/status

**Authentication:** Required

**Role:** Admin

**Description:**

Activates or deactivates a product.


# Order Lifecycle

The normal order lifecycle is:

Pending
↓
Processing
↓
Shipped
↓
Delivered

When an order is created:

paymentStatus = Pending

orderStatus = Pending

After successful payment:

paymentStatus = Paid

orderStatus = Processing

Seller fulfillment:

Processing → Shipped

Shipped → Delivered


# Payment Status

Supported payment statuses:

- Pending
- Paid
- Failed
- Refunded


# Order Status

Supported order statuses:

- Pending
- Processing
- Shipped
- Delivered
- Cancelled


# Authentication

Protected APIs use JWT Bearer authentication.

Header:

Authorization: Bearer JWT_TOKEN


# Image Upload

Product and store images are uploaded using:

- Multer
- Cloudinary

Maximum product images:

5

Maximum image size:

5 MB per image


# Error Handling

The API uses centralized error handling.

Example error response:

{
    "success": false,
    "message": "Error message"
}


# Security

The backend includes:

- JWT Authentication
- Role-based authorization
- Password hashing
- API rate limiting
- Helmet security headers
- CORS
- Request validation
- Centralized error handling
- Blocked user protection


# Technology Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Cloudinary
- Multer
- Express Rate Limit
- Helmet
- CORS


# Payment Note

The current development version uses a Dummy Payment Gateway.

Payment Gateway integration can be added in a future production version.