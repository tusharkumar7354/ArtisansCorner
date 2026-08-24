import api from "./api";
import API_ROUTES from "../constants/apiRoutes";

const getDashboard = async () => {
  const { data } = await api.get(
    API_ROUTES.ADMIN.DASHBOARD,
  );

  return data;
};

const getUsers = async () => {
  const { data } = await api.get(
    API_ROUTES.ADMIN.USERS,
  );

  return data;
};

const getSellers = async () => {
  const { data } = await api.get(
    API_ROUTES.ADMIN.SELLERS,
  );

  return data;
};

const getProducts = async () => {
  const { data } = await api.get(
    API_ROUTES.ADMIN.PRODUCTS,
  );

  return data;
};

const getOrders = async () => {
  const { data } = await api.get(
    API_ROUTES.ADMIN.ORDERS,
  );

  return data;
};

const toggleUserBlock = async (userId) => {
  const { data } = await api.patch(
    API_ROUTES.ADMIN.TOGGLE_USER(userId),
  );

  return data;
};

const deleteUser = async (userId) => {
  const { data } = await api.delete(
    API_ROUTES.ADMIN.DELETE_USER(userId),
  );

  return data;
};

const updateProductStatus = async (
  productId,
) => {
  const { data } = await api.patch(
    API_ROUTES.ADMIN.UPDATE_PRODUCT_STATUS(
      productId,
    ),
  );

  return data;
};

const updateOrderStatus = async (
  orderId,
  status,
) => {
  const { data } = await api.patch(
    API_ROUTES.ADMIN.UPDATE_ORDER_STATUS(
      orderId,
    ),
    {
      status,
    },
  );

  return data;
};

const adminService = {
  getDashboard,
  getUsers,
  getSellers,
  getProducts,
  getOrders,
  toggleUserBlock,
  deleteUser,
  updateProductStatus,
  updateOrderStatus,
};

export default adminService;