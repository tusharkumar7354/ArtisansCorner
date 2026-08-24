import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import orderService from "../../services/orderService";
import formatCurrency from "../../utils/formatCurrency";
import formatDate from "../../utils/formatDate";
import getErrorMessage from "../../utils/errorHandler";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await orderService.getMyOrders();

        setOrders(response.data?.orders || response.data || []);
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <Loader text="Loading your orders..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <main className="min-h-[70vh] bg-stone-50 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
            Purchase History
          </p>

          <h1 className="mt-2 text-3xl font-black text-stone-900 sm:text-4xl">
            My Purchases
          </h1>

          <p className="mt-2 text-stone-600">
            View your orders, payment status and purchase details.
          </p>
        </div>

        {orders.length === 0 ? (
          <section className="rounded-2xl border border-stone-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto max-w-md">
              <h2 className="text-xl font-bold text-stone-900">
                No orders yet
              </h2>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                You have not placed any orders yet. Explore our handmade
                products and make your first purchase.
              </p>

              <Link
                to="/products"
                className="mt-6 inline-flex rounded-xl bg-amber-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-800"
              >
                Browse Products
              </Link>
            </div>
          </section>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const orderStatus = order.orderStatus || "Pending";
              const paymentStatus = order.paymentStatus || "Pending";
              const orderNumber = order.orderNumber || "N/A";
              const items = order.items || [];

              return (
                <article
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="border-b border-stone-200 bg-stone-50 p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                          Order
                        </p>

                        <h2 className="mt-1 break-all text-lg font-bold text-stone-900">
                          #{orderNumber}
                        </h2>

                        <p className="mt-1 text-sm text-stone-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800">
                          {orderStatus}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                            paymentStatus === "Paid"
                              ? "bg-green-100 text-green-800"
                              : paymentStatus === "Failed"
                                ? "bg-red-100 text-red-800"
                                : "bg-stone-100 text-stone-700"
                          }`}
                        >
                          Payment: {paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="space-y-4">
                      {items.length === 0 ? (
                        <p className="text-sm text-stone-500">
                          No product information available.
                        </p>
                      ) : (
                        items.map((item, index) => {
                          const title = item.product?.title || "Product";
                          const quantity = Number(item.quantity || 0);
                          const price = Number(item.price || 0);
                          const subtotal = price * quantity;

                          return (
                            <div
                              key={
                                item._id ||
                                item.product?._id ||
                                `${title}-${index}`
                              }
                              className="flex flex-col gap-3 border-b border-stone-100 pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                            >
                              <div className="min-w-0">
                                <h3 className="font-semibold text-stone-900">
                                  {title}
                                </h3>

                                <div className="mt-1 flex flex-wrap gap-x-4 text-sm text-stone-500">
                                  <span>Qty: {quantity}</span>

                                  <span>
                                    Unit Price: {formatCurrency(price)}
                                  </span>
                                </div>
                              </div>

                              <p className="shrink-0 font-bold text-stone-900">
                                {formatCurrency(subtotal)}
                              </p>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="mt-6 flex flex-col gap-4 border-t border-stone-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-stone-500">Order Total</p>

                        <p className="mt-1 text-2xl font-black text-amber-700">
                          {formatCurrency(order.totalAmount || 0)}
                        </p>
                      </div>

                      <Link
                        to={`/orders/${order._id}`}
                        className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 transition hover:border-amber-400 hover:text-amber-700"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyOrders;
