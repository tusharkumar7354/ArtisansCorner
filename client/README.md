# Artisan's Corner Client Documentation

## Overview

Artisan's Corner is a React-based frontend for a handmade products marketplace.

The frontend supports three main roles:

- Buyer
- Seller
- Admin

The application provides product browsing, authentication, shopping cart, checkout, orders, reviews, seller management, seller analytics, and admin management.

---

# 1. Authentication

## Register User

**Route:**

/register

**Authentication:** Not Required

**Description:**

Allows a new user to create an account.

The registration flow sends an email verification OTP before the account is considered verified.

The registration flow is:

Register

↓

Send OTP

↓

Verify Email

↓

Registration Successful

---

## Login User

**Route:**

/login

**Authentication:** Not Required

**Description:**

Allows a user to log in and stores the authentication token for protected API requests.

---

## Resend Verification OTP

**Authentication:** Not Required

**Description:**

Allows a user to request a new email verification OTP during registration.

---

## Forgot Password

**Route:**

/forgot-password

**Authentication:** Not Required

**Description:**

Provides the frontend interface for password recovery.

---

## Logout User

**Authentication:** Required

**Description:**

Logs the current user out and clears the stored authentication information.

---

# 2. Public Marketplace

## Home

**Route:**

/

**Authentication:** Not Required

**Description:**

Displays the Artisan's Corner marketplace homepage.

---

## Products

**Route:**

/products

**Authentication:** Not Required

**Description:**

Displays available marketplace products.

The page supports product search and product browsing.

---

## Product Details

**Route:**

/products/:id

**Authentication:** Not Required

**Description:**

Displays detailed information about a product.

The page includes:

- Product information
- Product images
- Price
- Stock
- Seller information
- Store information
- Ratings
- Reviews

Authenticated users can add eligible products to their cart.

---

# 3. Buyer

Buyer functionality requires authentication.

## Shopping Cart

**Route:**

/cart

**Authentication:** Required

**Role:** Buyer

**Description:**

Displays the authenticated user's shopping cart.

The cart supports:

- Add products
- Update quantity
- Remove products
- Clear cart

Cart state is managed through `CartContext`.

---

## Checkout

**Route:**

/checkout

**Authentication:** Required

**Role:** Buyer

**Description:**

Provides the checkout interface.

The checkout flow is:

Cart
↓
Checkout
↓
Place Order
↓
Dummy Payment
↓
Order Details

---

## My Orders

**Route:**

/my-orders

**Authentication:** Required

**Role:** Buyer

**Description:**

Displays orders belonging to the authenticated buyer.

---

## Orders

**Route:**

/orders

**Authentication:** Required

**Role:** Buyer

**Description:**

Displays the authenticated buyer's orders.

---

## Order Details

**Route:**

/orders/:id

**Authentication:** Required

**Description:**

Displays details of a specific order.

---

## Shipping Address

**Route:**

/shipping

**Authentication:** Required

**Description:**

Allows the authenticated user to manage their shipping address.

---

## Profile

**Route:**

/profile

**Authentication:** Required

**Description:**

Displays the authenticated user's profile.

---

## Edit Profile

**Route:**

/profile/edit

**Authentication:** Required

**Description:**

Allows the authenticated user to update profile information.

---

# 4. Reviews and Ratings

## Product Reviews

**Route:**

/products/:id

**Authentication:** Required for creating, updating, or deleting reviews.

**Description:**

Users can review products from the product details page.

Review functionality includes:

- Create Review
- View Reviews
- Update Own Review
- Delete Own Review
- 1-5 Star Rating

---

# 5. Seller

Seller functionality requires active seller access.

## Become Seller

**Route:**

/become-seller

**Authentication:** Required

**Description:**

Allows an authenticated user to become a seller and create a seller store.

---

## Seller Dashboard

**Route:**

/seller/dashboard

**Authentication:** Required

**Role:** Seller

**Description:**

Displays seller dashboard information and provides access to seller management features.

---

## Seller Products

**Route:**

/seller/products

**Authentication:** Required

**Role:** Seller

**Description:**

Displays products belonging to the authenticated seller.

---

## Create Product

**Route:**

/seller/create-product

**Authentication:** Required

**Role:** Seller

**Description:**

Provides the form for creating a new product.

---

## Edit Product

**Route:**

/seller/edit-product/:id

**Authentication:** Required

**Role:** Seller

**Description:**

Allows a seller to edit one of their products.

---

## Seller Orders

**Route:**

/seller/orders

**Authentication:** Required

**Role:** Seller

**Description:**

Displays customer orders containing products belonging to the authenticated seller.

Sellers can update eligible order statuses.

---

## Sales History

**Route:**

/seller/sales

**Authentication:** Required

**Role:** Seller

**Description:**

Displays seller sales information and analytics.

The page includes:

- Gross Sales
- Platform Fee
- Seller Earnings
- Total Sales
- Items Sold
- Sales History
- Sales Chart

---

## Seller Settings

**Route:**

/seller/settings

**Authentication:** Required

**Role:** Seller

**Description:**

Allows the seller to manage store information and store status.

Store management includes:

- Store Name
- Store Description
- Store Logo
- Close Store
- Reopen Store

---

# 6. Admin

Admin functionality requires the `admin` role.

## Admin Dashboard

**Route:**

/admin/dashboard

**Authentication:** Required

**Role:** Admin

**Description:**

Displays platform-level statistics.

Dashboard statistics include:

- Total Users
- Seller Stores
- Products
- Orders
- Paid Orders
- Pending Orders
- Marketplace Revenue

---

## Manage Users

**Route:**

/admin/users

**Authentication:** Required

**Role:** Admin

**Description:**

Allows administrators to view marketplace users and block or unblock user accounts.

---

## Manage Sellers

**Route:**

/admin/sellers

**Authentication:** Required

**Role:** Admin

**Description:**

Allows administrators to monitor sellers and their stores.

The page displays:

- Seller Name
- Seller Email
- Store Name
- Store Status
- Roles
- Account Status

Administrators can block or unblock seller accounts.

---

## Manage Products

**Route:**

/admin/products

**Authentication:** Required

**Role:** Admin

**Description:**

Allows administrators to monitor marketplace products.

Administrators can:

- View Products
- View Seller
- View Store
- View Category
- Activate Products
- Deactivate Products

---

## Manage Categories

**Route:**

/admin/categories

**Authentication:** Required

**Role:** Admin

**Description:**

Allows administrators to manage product categories.

Administrators can:

- View Categories
- Create Categories
- Edit Categories
- Delete Categories

---

## Manage Orders

**Route:**

/admin/orders

**Authentication:** Required

**Role:** Admin

**Description:**

Allows administrators to monitor marketplace orders and update order status.

---

# 7. Authentication and Route Protection

The frontend uses JWT authentication.

Protected API requests include:

Authorization: Bearer JWT_TOKEN

The frontend contains three route protection components:

- ProtectedRoute
- SellerRoute
- AdminRoute

### ProtectedRoute

Requires authentication.

Unauthenticated users are redirected to:

/login

### SellerRoute

Requires authenticated seller access.

Users without seller access are redirected to:

/become-seller

### AdminRoute

Requires the `admin` role.

Non-admin users are redirected to:

/

---

# 8. State Management

The frontend uses React Context API.

## AuthContext

Responsible for:

- Authentication state
- Current user
- Login
- Registration
- Logout
- Profile loading
- Profile refresh

## CartContext

Responsible for:

- Cart state
- Cart total
- Cart loading
- Cart errors
- Fetching cart
- Adding products
- Updating quantities
- Removing products
- Clearing cart

---

# 9. API Services

The frontend communicates with the backend through service modules.

## Authentication

File:

src/services/authService.js

Handles:

- Register
- Verify Email
- Resend Verification OTP
- Login
- Logout
- Get Profile
- Update Profile
- Update Shipping Address

---

## Products

File:

src/services/productService.js

Handles:

- Get Products
- Get Product Details
- Get Seller Products
- Create Product
- Update Product
- Delete Product

---

## Cart

File:

src/services/cartService.js

Handles:

- Get Cart
- Add Product
- Update Quantity
- Remove Product
- Clear Cart

---

## Orders

File:

src/services/orderService.js

Handles:

- Place Order
- Get My Orders
- Get Order Details

---

## Payments

File:

src/services/paymentService.js

Handles the current Dummy Payment flow.

---

## Reviews

File:

src/services/reviewService.js

Handles:

- Create Review
- Get Product Reviews
- Update Review
- Delete Review

---

## Seller

File:

src/services/sellerService.js

Handles:

- Become Seller
- Get Store
- Update Store
- Close Store
- Reopen Store
- Get Seller Orders
- Update Seller Order Status
- Get Seller Analytics

---

## Categories

File:

src/services/categoryService.js

Handles:

- Get Categories
- Create Category
- Update Category
- Delete Category

---

## Admin

File:

src/services/adminService.js

Handles:

- Get Dashboard
- Get Users
- Get Sellers
- Get Products
- Get Orders
- Block / Unblock Users
- Update Product Status
- Update Order Status

---

# 10. API Client

The centralized Axios client is:

src/services/api.js

Base API URL:

https://artisanscornerapi.onrender.com/api

The URL can be configured using:

VITE_API_URL

The Axios client automatically attaches the JWT token to authenticated requests.

If the backend returns:

401 Unauthorized

the frontend clears the stored authentication information.

---

# 11. Payment

The current frontend uses the backend Dummy Payment Gateway.

The current payment flow is:

Place Order
↓
Payment
↓
Payment Successful
↓
Order Processing

Stripe is not currently integrated into the frontend.

---

# 12. Order Status

The frontend supports:

- Pending
- Processing
- Shipped
- Delivered
- Cancelled

Seller fulfillment normally follows:

Processing
↓
Shipped
↓
Delivered

---

# 13. Image Handling

Product images are selected through the seller product form.

The frontend sends product information and selected images to the backend.

The frontend does not store product images in the database.

Image storage and processing are handled by the backend.

---

# 14. Environment Variables

Create a `.env` file in the client root.

Example:

VITE_API_URL=https://artisanscornerapi.onrender.com/api

The `.env` file must not be committed to GitHub.

Frontend environment variables must not contain backend secrets.

---

# 15. Running the Client

Install dependencies:

npm install

Start development server:

npm run dev

Create production build:

npm run build

Preview production build:

npm run preview

Run ESLint:

npm run lint

Production Deployment:

Build the client with:

npm run build

The production frontend is deployed on Netlify.

Production URL:

https://artisanscorner.netlify.app/

Base URL:

http://localhost:5173

---

# 16. Technology Stack

- React
- React Router
- Axios
- Tailwind CSS
- React Hook Form
- Context API
- Chart.js
- react-chartjs-2
- Lucide React
- React Icons
- React Hot Toast
- Vite

---

# 17. Main Client Structure

src/

components/

context/

hooks/

layouts/

pages/

routes/

services/

constants/

styles/

utils/

App.jsx

main.jsx

---

# 18. Error Handling

The frontend uses reusable error and loading components:

- Loader
- ErrorMessage
- EmptyState

API errors are processed through:

src/utils/errorHandler.js

User notifications are handled through the toast utility.

---

# 19. Responsive Design

The frontend uses responsive Tailwind CSS classes and project responsive styles.

Responsive styles are maintained in:

src/styles/responsive.css

---

# 20. Backend Dependency

The frontend requires the Artisan's Corner backend API.

Default API URL:

https://artisanscornerapi.onrender.com/api

The frontend depends on the backend for:

- Authentication
- Products
- Categories
- Cart
- Orders
- Payments
- Reviews
- Seller Management
- Admin Management

---

# 21. Security

The frontend implements:

- JWT Authentication
- Protected Routes
- Seller Route Protection
- Admin Route Protection
- Unauthorized Session Cleanup
- Environment Variable Separation

Frontend route protection does not replace backend authorization.

The backend must independently validate authentication and permissions.

---

# 22. Project Purpose

Artisan's Corner Client is the frontend application for a multi-vendor handmade products marketplace.

It demonstrates:

- React Development
- Authentication
- Role-Based Access
- REST API Integration
- Product Management
- Shopping Cart
- Checkout
- Order Management
- Reviews and Ratings
- Seller Management
- Seller Analytics
- Admin Management
- Responsive UI
- Reusable Components

---

# Author

Tushar Kumar
