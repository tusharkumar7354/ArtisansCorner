import { createContext, useCallback, useState } from "react";
import cartService from "../services/cartService";

const CartContext = createContext(null);

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await cartService.getCart();
      const cartData = response?.data ?? response;
      const cart = cartData?.cart ?? cartData;
      setCart(cart);

      const total = (cart?.items || []).reduce((sum, item) => {
        const price = Number(item.product?.price || item.price || 0);
        const quantity = Number(item.quantity || 0);
        return sum + price * quantity;
      }, 0);

      setTotalAmount(total);
      return cart;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch cart";
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    try {
      setError("");
      const response = await cartService.addToCart(productId, quantity);
      await fetchCart();
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to add product to cart";
      setError(message);
      throw error;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      setError("");
      const response = await cartService.updateCartItem(productId, quantity);
      await fetchCart();
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update cart";
      setError(message);
      throw error;
    }
  };

  const removeCartItem = async (productId) => {
    try {
      setError("");
      const response = await cartService.removeCartItem(productId);
      await fetchCart();
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to remove item";
      setError(message);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      setError("");
      const response = await cartService.clearCart();
      await fetchCart();
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to clear cart";
      setError(message);
      throw error;
    }
  };

  const resetCart = () => {
    setCart(null);
    setTotalAmount(0);
    setError("");
  };

  const value = {
    cart,
    totalAmount,
    loading,
    error,
    fetchCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    resetCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export { CartContext, CartProvider };
