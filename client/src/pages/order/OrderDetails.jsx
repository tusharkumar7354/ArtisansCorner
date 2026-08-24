import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import orderService from "../../services/orderService";
import formatCurrency from "../../utils/formatCurrency";
import formatDate from "../../utils/formatDate";
import getErrorMessage from "../../utils/errorHandler";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await orderService.getOrderById(id);

        setOrder(response.data?.order || response.data);
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  if (loading) {
    return <Loader text="Loading order details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!order) {
    return (
      <main className="min-h-[70vh] bg-stone-50 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <ErrorMessage message="Order not found." />
        </div>
      </main>
    );
  }

  const orderStatus = order.orderStatus || order.status || "Pending";
  const paymentStatus = order.paymentStatus || "Pending";
  const orderNumber = order.orderNumber || "N/A";
  const items = order.items || [];
  const shippingAddress = order.shippingAddress || {};

  return (
    <main className="min-h-[70vh] bg-stone-50 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
            Order Management
          </p>

          <h1 className="mt-2 text-3xl font-black text-stone-900 sm:text-4xl">
            Order Details
          </h1>

          <p className="mt-2 text-stone-600">Order #{orderNumber}</p>

          <p className="mt-1 text-sm text-stone-500">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-stone-500">Order Status</p>

              <span className="mt-2 inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800">
                {orderStatus}
              </span>
            </div>

            <div>
              <p className="text-sm font-medium text-stone-500">
                Payment Status
              </p>

              <span
                className={`mt-2 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                  paymentStatus === "Paid"
                    ? "bg-green-100 text-green-800"
                    : paymentStatus === "Failed"
                      ? "bg-red-100 text-red-800"
                      : "bg-stone-100 text-stone-700"
                }`}
              >
                {paymentStatus}
              </span>
            </div>

            <div>
              <p className="text-sm font-medium text-stone-500">Order Date</p>

              <p className="mt-2 font-semibold text-stone-900">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-stone-900">
            Customer & Shipping
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl bg-stone-50 p-5">
              <p className="text-sm font-medium text-stone-500">Customer</p>

              <p className="mt-2 font-semibold text-stone-900">
                {order.buyer?.name ||
                  order.user?.name ||
                  shippingAddress.fullName ||
                  "Customer"}
              </p>

              {(order.buyer?.email || order.user?.email) && (
                <p className="mt-1 text-sm text-stone-600">
                  {order.buyer?.email || order.user?.email}
                </p>
              )}
            </div>

            <div className="rounded-xl bg-stone-50 p-5">
              <p className="text-sm font-medium text-stone-500">
                Shipping Address
              </p>

              <div className="mt-2 text-sm leading-6 text-stone-700">
                {shippingAddress.fullName && (
                  <p className="font-semibold text-stone-900">
                    {shippingAddress.fullName}
                  </p>
                )}

                {shippingAddress.phone && <p>{shippingAddress.phone}</p>}

                {shippingAddress.address && <p>{shippingAddress.address}</p>}

                {(shippingAddress.city ||
                  shippingAddress.state ||
                  shippingAddress.pincode) && (
                  <p>
                    {shippingAddress.city}
                    {shippingAddress.city && shippingAddress.state ? ", " : ""}
                    {shippingAddress.state}
                    {shippingAddress.pincode
                      ? ` - ${shippingAddress.pincode}`
                      : ""}
                  </p>
                )}

                {shippingAddress.country && <p>{shippingAddress.country}</p>}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-200 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-stone-900">Products</h2>

            <p className="mt-1 text-sm text-stone-500">
              Products included in this order.
            </p>
          </div>

          <div className="divide-y divide-stone-200">
            {items.length === 0 ? (
              <div className="p-8 text-center text-stone-500">
                No products found in this order.
              </div>
            ) : (
              items.map((item, index) => {
                const productTitle = item.product?.title || "Product";
                const quantity = Number(item.quantity || 0);
                const unitPrice = Number(item.price || 0);
                const subtotal = unitPrice * quantity;

                return (
                  <div
                    key={
                      item._id ||
                      item.product?._id ||
                      `${productTitle}-${index}`
                    }
                    className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <h3 className="font-semibold text-stone-900">
                        {productTitle}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-stone-500">
                        <span>Unit Price: {formatCurrency(unitPrice)}</span>

                        <span>Quantity: {quantity}</span>
                      </div>
                    </div>

                    <div className="shrink-0 text-left sm:text-right">
                      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                        Item Total
                      </p>

                      <p className="mt-1 font-bold text-stone-900">
                        {formatCurrency(subtotal)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-stone-200 bg-stone-50 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-stone-900">
                Order Total
              </span>

              <span className="text-2xl font-black text-amber-700">
                {formatCurrency(order.totalAmount || 0)}
              </span>
            </div>
          </div>
        </section>

        <div className="mt-6">
          <Link
            to="/my-orders"
            className="inline-flex rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-amber-400 hover:text-amber-700"
          >
            Back to My Orders
          </Link>
        </div>
      </div>
    </main>
  );
};

export default OrderDetails;
