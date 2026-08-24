import { useEffect, useState } from "react";
import sellerService from "../../services/sellerService";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import formatCurrency from "../../utils/formatCurrency";
import formatDate from "../../utils/formatDate";
import getErrorMessage from "../../utils/errorHandler";
import toastService from "../../utils/toast";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await sellerService.getSellerOrders();

        setOrders(response.data || []);
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      setError("");

      const response = await sellerService.updateOrderStatus(orderId, status);
      const updatedOrder = response.data;

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus: updatedOrder?.orderStatus || order.orderStatus,
                sellerOrderStatus:
                  updatedOrder?.sellerOrderStatus || status,
                items: updatedOrder?.items || order.items,
              }
            : order,
        ),
      );

      toastService.success(`Order marked as ${status}.`);
    } catch (error) {
      toastService.error(getErrorMessage(error));
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!orders.length) {
    return (
      <EmptyState
        title="No Orders"
        description="No customer orders containing your products yet."
      />
    );
  }

  return (
    <main className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
          Order Management
        </p>
        <h1 className="mt-2 text-4xl font-black text-stone-900">
          Customer Orders
        </h1>
        <p className="mt-2 text-stone-600">
          View customer purchases and manage orders containing your products.
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <article
            key={order._id}
            className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
          >
            <div className="border-b border-stone-200 bg-stone-50 p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Order
                  </p>
                  <h2 className="mt-1 break-all text-base font-bold text-stone-900 sm:text-lg">
                    #{order.orderNumber || order._id?.slice(-8).toUpperCase()}
                  </h2>
                  <p className="mt-1 text-sm text-stone-500">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      order.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    Payment: {order.paymentStatus}
                  </span>

                  <span className="rounded-full bg-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-700">
                    {order.sellerOrderStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
                <section>
                  <h3 className="font-semibold text-stone-900">Customer</h3>

                  <div className="mt-3 rounded-xl bg-stone-50 p-4 text-sm">
                    <p className="font-medium text-stone-900">
                      {order.buyer?.name || "Buyer"}
                    </p>
                    <p className="mt-1 break-all text-stone-500">
                      {order.buyer?.email || "-"}
                    </p>
                  </div>

                  <div className="mt-5 rounded-xl border border-stone-200 p-4">
                    <p className="text-sm text-stone-500">Your order value</p>
                    <p className="mt-1 text-2xl font-bold text-stone-900">
                      {formatCurrency(order.sellerTotal || 0)}
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="font-semibold text-stone-900">
                    Your Products
                  </h3>

                  <div className="mt-3 space-y-3">
                    {order.items?.map((item) => (
                      <div
                        key={item.product?._id || item._id}
                        className="flex gap-4 rounded-xl border border-stone-200 p-3"
                      >
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                          {item.product?.images?.[0]?.url ? (
                            <img
                              src={item.product.images[0].url}
                              alt={item.product.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-stone-400">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-stone-900">
                            {item.product?.title || "Product"}
                          </p>
                          <p className="mt-1 text-sm text-stone-500">
                            Quantity: {item.quantity}
                          </p>
                          <p className="mt-1 text-sm font-medium text-stone-700">
                            {formatCurrency(item.price)}
                          </p>
                          <p className="mt-2 text-xs font-semibold text-stone-600">
                            Status: {item.status || "Processing"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 border-t border-stone-200 pt-5">
                {order.paymentStatus !== "Paid" && (
                  <p className="text-sm text-amber-700">
                    This order cannot be shipped until payment is completed.
                  </p>
                )}

                {order.paymentStatus === "Paid" &&
                  order.sellerOrderStatus === "Processing" && (
                    <button
                      type="button"
                      disabled={updatingId === order._id}
                      onClick={() => handleStatusUpdate(order._id, "Shipped")}
                      className="rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {updatingId === order._id
                        ? "Updating..."
                        : "Mark as Shipped"}
                    </button>
                  )}

                {order.paymentStatus === "Paid" &&
                  order.sellerOrderStatus === "Shipped" && (
                    <button
                      type="button"
                      disabled={updatingId === order._id}
                      onClick={() =>
                        handleStatusUpdate(order._id, "Delivered")
                      }
                      className="rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {updatingId === order._id
                        ? "Updating..."
                        : "Mark as Delivered"}
                    </button>
                  )}

                {order.orderStatus === "Delivered" && (
                  <p className="text-sm font-semibold text-green-700">
                    Order delivered successfully.
                  </p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
};

export default SellerOrders;



