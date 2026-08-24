import api from "./api";
import API_ROUTES from "../constants/apiRoutes";

const getProducts = async () => {
    const { data } = await api.get(API_ROUTES.PRODUCT.ALL);
    return data;
};

const getProductById = async (id) => {
    const { data } = await api.get(API_ROUTES.PRODUCT.DETAILS(id));
    return data;
};

const getMyProducts = async () => {
    const { data } = await api.get(API_ROUTES.PRODUCT.MY_PRODUCTS);
    return data;
};

const createProduct = async (productData) => {
    const { data } = await api.post(API_ROUTES.PRODUCT.CREATE, productData);
    return data;
};

const updateProduct = async (id, productData) => {
    const { data } = await api.put(API_ROUTES.PRODUCT.UPDATE(id), productData);
    return data;
};

const deleteProduct = async (id) => {
    const { data } = await api.delete(API_ROUTES.PRODUCT.DELETE(id));
    return data;
};

const getSellerProducts = async () => {
    return getMyProducts();
};

export default {
    getProducts,
    getProductById,
    getMyProducts,
    getSellerProducts,
    createProduct,
    updateProduct,
    deleteProduct,
};