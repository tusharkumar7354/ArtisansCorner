import api from "./api";
import API_ROUTES from "../constants/apiRoutes";

const becomeSeller = async (sellerData) => {
    const { data } = await api.post(
        API_ROUTES.SELLER.BECOME,
        sellerData
    );
    return data;
};

const getStore = async () => {
    const { data } = await api.get(
        API_ROUTES.SELLER.STORE
    );
    return data;
};

const updateStore = async (storeData) => {
    const { data } = await api.put(
        API_ROUTES.SELLER.STORE,
        storeData
    );
    return data;
};

const closeStore = async () => {
    const { data } = await api.patch(
        API_ROUTES.SELLER.CLOSE_STORE
    );
    return data;
};

const reopenStore = async () => {
    const { data } = await api.patch(
        API_ROUTES.SELLER.REOPEN_STORE
    );
    return data;
};

const getSellerOrders = async () => {
    const { data } = await api.get(
        API_ROUTES.SELLER.ORDERS
    );
    return data;
};

const getSellerAnalytics = async () => {
    const { data } = await api.get(
        API_ROUTES.SELLER.ANALYTICS
    );
    return data;
};

const updateOrderStatus = async (
    orderId,
    status
) => {
    const { data } = await api.patch(
        API_ROUTES.SELLER.UPDATE_ORDER_STATUS(orderId),
        {
            status,
        }
    );
    return data;
};

const sellerService = {
    becomeSeller,
    getStore,
    updateStore,
    closeStore,
    reopenStore,
    getSellerOrders,
    getSellerAnalytics,
    updateOrderStatus,
};

export default sellerService;