import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import adminService from "../../services/adminService";
import formatCurrency from "../../utils/formatCurrency";
import formatDate from "../../utils/formatDate";
import getErrorMessage from "../../utils/errorHandler";
import toastService from "../../utils/toast";

const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered"];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async () => {
    const response = await adminService.getOrders();
    setOrders(response.data || []);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        await loadOrders();
      } catch (error) {
        toastService.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      await adminService.updateOrderStatus(orderId, status);
      await loadOrders();
      toastService.success("Order status updated successfully.");
    } catch (error) {
      toastService.error(getErrorMessage(error));
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <main className="min-h-[70vh] bg-stone-50 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-3">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
            Administration
          </p>
          <h1 className="mt-2 text-3xl font-bold text-stone-900">
            Manage Orders
          </h1>
          <p className="mt-2 text-stone-600">
            Monitor marketplace orders and update their status.
          </p>
        </div>

        {!orders.length ? (
          <EmptyState
            title="No Orders"
            description="No orders have been placed yet."
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="bg-stone-50">
                  <tr className="border-b border-stone-200">
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Order
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Customer
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Items
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Amount
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Payment
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Status
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-200">
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="transition hover:bg-stone-50"
                    >
                      {/* Order */}
                      <td className="px-5 py-5">
                        <p
                          title={order.orderNumber}
                          className="font-semibold text-stone-900"
                        >
                          #{order.orderNumber || order._id.slice(-6)}
                        </p>
                        <p className="mt-1 text-xs text-stone-500">
                          {order.items?.length || 0}{" "}
                          {order.items?.length === 1 ? "item" : "items"}
                        </p>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-5">
                        <p className="font-medium text-stone-900">
                          {order.buyer?.name || "Buyer"}
                        </p>
                        <p className="mt-1 max-w-[220px] truncate text-xs text-stone-500">
                          {order.buyer?.email || "-"}
                        </p>
                      </td>

                      {/* Items */}
                      <td className="px-5 py-5">
                        <div className="max-w-[260px] space-y-1">
                          {order.items?.slice(0, 3).map((item, index) => (
                            <p
                              key={`${order._id}-${index}`}
                              className="truncate text-sm text-stone-700"
                              title={item.product?.title || "Product"}
                            >
                              {item.product?.title || "Product"} ×{" "}
                              {item.quantity}
                            </p>
                          ))}
                          {order.items?.length > 3 && (
                            <p className="text-xs font-medium text-stone-400">
                              +{order.items.length - 3} more
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-5 font-semibold text-stone-900">
                        {formatCurrency(order.totalAmount)}
                      </td>

                      {/* Payment */}
                      <td className="px-5 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            order.paymentStatus === "Paid"
                              ? "bg-green-100 text-green-700"
                              : order.paymentStatus === "Refunded"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {order.paymentStatus || "Pending"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-5">
                        <select
                          value={order.orderStatus}
                          disabled={updatingId === order._id}
                          onChange={(event) =>
                            handleStatusChange(order._id, event.target.value)
                          }
                          className={`rounded-lg border px-3 py-2 text-sm font-semibold outline-none transition focus:ring-2 focus:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-50 ${
                            order.orderStatus === "Delivered"
                              ? "border-green-200 bg-green-50 text-green-700"
                              : "border-stone-300 bg-white text-stone-700"
                          }`}
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Date */}
                      <td className="whitespace-nowrap px-5 py-5 text-sm text-stone-600">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );


};

export default ManageOrders;


