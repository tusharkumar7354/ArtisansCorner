import api from "./api";
import API_ROUTES from "../constants/apiRoutes";

const register = async (userData) => {
    const { data } = await api.post(API_ROUTES.AUTH.REGISTER, userData);
    return data;
};

const login = async (credentials) => {
    const { data } = await api.post(API_ROUTES.AUTH.LOGIN, credentials);
    return data;
};

const logout = async () => {
    const { data } = await api.post(API_ROUTES.AUTH.LOGOUT);
    return data;
};

const getProfile = async () => {
    const { data } = await api.get(API_ROUTES.AUTH.PROFILE);
    return data;
};

const updateProfile = async (profileData) => {
    const { data } = await api.put(API_ROUTES.AUTH.PROFILE,profileData);
    return data;
};

const updateShippingAddress = async (addressData) => {
    const { data } = await api.put(API_ROUTES.AUTH.ADDRESS,addressData);
    return data;
};

export default {
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    updateShippingAddress,
};