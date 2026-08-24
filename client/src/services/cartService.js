import api from "./api";
import API_ROUTES from "../constants/apiRoutes";

const addToCart = async (productId, quantity = 1) => {
  const { data } = await api.post(API_ROUTES.CART.ADD, {
    productId,
    quantity,
  });

  return data;
};

const getCart = async () => {
  const { data } = await api.get(API_ROUTES.CART.GET);

  return data;
};

const updateCartItem = async (productId, quantity) => {
  const { data } = await api.put(API_ROUTES.CART.UPDATE(productId), {
    quantity,
  });

  return data;
};

const removeCartItem = async (productId) => {
  const { data } = await api.delete(API_ROUTES.CART.REMOVE(productId));

  return data;
};

const clearCart = async () => {
  const { data } = await api.delete(API_ROUTES.CART.CLEAR);

  return data;
};

const cartService = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};

export default cartService;



