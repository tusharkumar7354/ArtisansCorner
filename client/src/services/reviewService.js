import api from "./api";
import API_ROUTES from "../constants/apiRoutes";

const createReview = async (reviewData) => {
    const { data } = await api.post(
        API_ROUTES.REVIEW.CREATE,
        reviewData
    );
    return data;
};

const getProductReviews = async (productId) => {
    const { data } = await api.get(
        API_ROUTES.REVIEW.PRODUCT(productId)
    );
    return data;
};

const updateReview = async (
    reviewId,
    reviewData
) => {
    const { data } = await api.put(
        API_ROUTES.REVIEW.UPDATE(reviewId),
        reviewData
    );
    return data;
};

const deleteReview = async (reviewId) => {
    const { data } = await api.delete(
        API_ROUTES.REVIEW.DELETE(reviewId)
    );
    return data;
};

export default {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview,
};