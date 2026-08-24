import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import SellerLayout from "../layouts/SellerLayout";
import AdminLayout from "../layouts/AdminLayout";

import ProtectedRoute from "./ProtectedRoute";
import SellerRoute from "./SellerRoute";
import AdminRoute from "./AdminRoute";

import Home from "../pages/home/Home";

import Products from "../pages/products/Products";
import ProductDetails from "../pages/products/ProductDetails";

import Cart from "../pages/cart/Cart";
import Checkout from "../pages/checkout/Checkout";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import Profile from "../pages/profile/Profile";
import EditProfile from "../pages/profile/EditProfile";
import NotFound from "../pages/profile/NotFound";

import MyOrders from "../pages/order/MyOrders";
import OrderDetails from "../pages/order/OrderDetails";
import Orders from "../pages/order/Orders";
import ShippingAddress from "../pages/order/ShippingAddress";

import BecomeSeller from "../pages/seller/BecomeSeller";
import SellerDashboard from "../pages/seller/SellerDashboard";
import SellerProducts from "../pages/seller/SellerProducts";
import CreateProduct from "../pages/seller/CreateProduct";
import EditProduct from "../pages/seller/EditProduct";
import SellerOrders from "../pages/seller/SellerOrders";
import SalesHistory from "../pages/seller/SalesHistory";
import SellerSettings from "../pages/seller/SellerSettings";

import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageSellers from "../pages/admin/ManageSellers";
import ManageProducts from "../pages/admin/ManageProducts";
import ManageOrders from "../pages/admin/ManageOrders";
import ManageCategories from "../pages/admin/ManageCategories";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/shipping"
          element={
            <ProtectedRoute>
              <ShippingAddress />
            </ProtectedRoute>
          }
        />

        <Route
          path="/become-seller"
          element={
            <ProtectedRoute>
              <BecomeSeller />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      <Route
        path="/seller"
        element={
          <SellerRoute>
            <SellerLayout />
          </SellerRoute>
        }
      >
        <Route index element={<SellerDashboard />} />
        <Route path="dashboard" element={<SellerDashboard />} />
        <Route path="products" element={<SellerProducts />} />
        <Route path="create-product" element={<CreateProduct />} />
        <Route path="edit-product/:id" element={<EditProduct />} />
        <Route path="orders" element={<SellerOrders />} />
        <Route path="sales" element={<SalesHistory />} />
        <Route path="settings" element={<SellerSettings />} />
      </Route>

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="sellers" element={<ManageSellers />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="orders" element={<ManageOrders />} />
        <Route path="categories" element={<ManageCategories />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
