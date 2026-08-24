import api from "./api";
import API_ROUTES from "../constants/apiRoutes";

const payOrder = async (orderId) => {
    const { data } = await api.post(
        API_ROUTES.PAYMENT.PAY,
        {
            orderId,
        }
    );

    return data;
};

const paymentService = {
    payOrder,
};

export default paymentService;