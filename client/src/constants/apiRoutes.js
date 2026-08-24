const API_ROUTES = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    PROFILE: "/auth/profile",
    ADDRESS: "/auth/address",
  },

  PRODUCT: {
    ALL: "/product/all",
    CREATE: "/product/create",
    MY_PRODUCTS: "/product/my-products",
    DETAILS: (id) => `/product/${id}`,
    UPDATE: (id) => `/product/update/${id}`,
    DELETE: (id) => `/product/delete/${id}`,
  },

  CATEGORY: {
    ALL: "/category/all",
    CREATE: "/category/create",
    UPDATE: (id) => `/category/${id}`,
    DELETE: (id) => `/category/${id}`,
  },

  CART: {
    GET: "/cart",
    ADD: "/cart/add",
    UPDATE: (id) => `/cart/update/${id}`,
    REMOVE: (id) => `/cart/remove/${id}`,
    CLEAR: "/cart/clear",
  },

  ORDER: {
    PLACE: "/order/place",
    MY: "/order/my-orders",
    DETAILS: (id) => `/order/${id}`,
  },

  REVIEW: {
    CREATE: "/review/create",
    PRODUCT: (id) => `/review/product/${id}`,
    UPDATE: (id) => `/review/${id}`,
    DELETE: (id) => `/review/${id}`,
  },

  SELLER: {
    BECOME: "/seller/become-seller",
    STORE: "/seller/store",
    CLOSE_STORE: "/seller/close-store",
    REOPEN_STORE: "/seller/reopen-store",
    ORDERS: "/seller/orders",
    ANALYTICS: "/seller/analytics",
    UPDATE_ORDER_STATUS: (id) => `/seller/order/${id}/status`,
  },

  PAYMENT: {
    PAY: "/payment/pay",
  },

  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    SELLERS: "/admin/sellers",
    PRODUCTS: "/admin/products",
    ORDERS: "/admin/orders",
    TOGGLE_USER: (id) => `/admin/user/${id}/block`,
    DELETE_USER: (id) => `/admin/user/${id}`,
    UPDATE_PRODUCT_STATUS: (id) => `/admin/product/${id}/status`,
    UPDATE_ORDER_STATUS: (id) => `/admin/order/${id}/status`,
  },
};

export default API_ROUTES;