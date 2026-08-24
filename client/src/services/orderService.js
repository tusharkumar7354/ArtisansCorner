import api from "./api";
import API_ROUTES from "../constants/apiRoutes";

const placeOrder = async () => {
  const { data } = await api.post(API_ROUTES.ORDER.PLACE);
  return data;
};

const getMyOrders = async () => {
  const { data } = await api.get(API_ROUTES.ORDER.MY);
  return data;
};

const getOrderById = async (id) => {
  const { data } = await api.get(API_ROUTES.ORDER.DETAILS(id));
  return data;
};

export default {
  placeOrder,
  getMyOrders,
  getOrderById,
};



