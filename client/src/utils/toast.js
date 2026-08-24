import toast from "react-hot-toast";

const showSuccess = (message, options = {}) => {
    toast.success(message, options);
};

const showError = (message, options = {}) => {
    toast.error(message, options);
};

const showInfo = (message, options = {}) => {
    toast(message, options);
};

const showLoading = (message, options = {}) => {
    return toast.loading(message, options);
};

const dismiss = (toastId) => {
    toast.dismiss(toastId);
};

const showPromise = (promise, messages, options = {}) => {
    return toast.promise(promise, messages, options);
};

const toastService = {
    success: showSuccess,
    error: showError,
    info: showInfo,
    loading: showLoading,
    dismiss,
    promise: showPromise,
};

export default toastService;


