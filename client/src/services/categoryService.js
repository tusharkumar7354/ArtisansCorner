import api from "./api";
import API_ROUTES from "../constants/apiRoutes";

const getCategories = async () => {
  const { data } = await api.get(API_ROUTES.CATEGORY.ALL);

  return data;
};

const createCategory = async (categoryData) => {
  const { data } = await api.post(
    API_ROUTES.CATEGORY.CREATE,
    categoryData,
  );

  return data;
};

const updateCategory = async (categoryId, categoryData) => {
  const { data } = await api.put(
    API_ROUTES.CATEGORY.UPDATE(categoryId),
    categoryData,
  );

  return data;
};

const deleteCategory = async (categoryId) => {
  const { data } = await api.delete(
    API_ROUTES.CATEGORY.DELETE(categoryId),
  );

  return data;
};

export default {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};



