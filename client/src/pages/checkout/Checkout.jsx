import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import useCart from "../../hooks/useCart";
import orderService from "../../services/orderService";
import paymentService from "../../services/paymentService";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import formatCurrency from "../../utils/formatCurrency";
import toastService from "../../utils/toast";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, totalAmount } = useCart();
  const [placingOrder, setPlacingOrder] = useState(false);

  if (!cart?.items?.length) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-stone-900">Checkout</h1>

        <p className="mt-6 text-stone-600">Your cart is empty.</p>

        <button
          type="button"
          onClick={() => navigate("/products")}
          className="mt-8 rounded-xl bg-amber-800 px-6 py-3 font-semibold text-white hover:bg-amber-900"
        >
          Browse Products
        </button>
      </main>
    );
  }

  const handlePlaceOrder = async () => {
    if (placingOrder) return;

    try {
      setPlacingOrder(true);

      const response = await orderService.placeOrder();
      const order = response?.data;

      if (!order?._id) {
        throw new Error(
          "Order was created, but order details could not be found.",
        );
      }

      await paymentService.payOrder(order._id);

      toastService.success("Order placed successfully.");

      navigate(`/orders/${order._id}`);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to place order.";

      if (message.toLowerCase().includes("shipping address not found")) {
        navigate("/profile/edit", {
          state: {
            from: "/checkout",
            message:
              "Please add your shipping address before placing the order.",
          },
        });

        return;
      }

      toastService.error(message);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
          Order
        </p>

        <h1 className="mt-2 text-4xl font-bold text-stone-900">Checkout</h1>

        <p className="mt-2 text-stone-600">
          Review your order before placing it.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-stone-900">Order Items</h2>

          <div className="mt-8 divide-y divide-stone-200">
            {cart.items.map((item) => {
              const product = item.product;
              const productPrice = Number(product.price) || 0;
              const quantity = Number(item.quantity) || 0;
              const itemTotal = productPrice * quantity;

              return (
                <div
                  key={product._id}
                  className="flex gap-4 py-5 first:pt-0 last:pb-0"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                    {product.images?.[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-stone-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-stone-900">
                      {product.title}
                    </h3>

                    <p className="mt-1 text-sm text-stone-500">
                      Quantity: {quantity}
                    </p>

                    <p className="mt-1 text-sm text-stone-500">
                      {formatCurrency(productPrice)} each
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-bold text-stone-900">
                      {formatCurrency(itemTotal)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="h-fit rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-stone-900">Order Summary</h2>

          <div className="mt-8 space-y-4">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>

              <span className="font-medium text-stone-900">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            <div className="flex justify-between text-stone-600">
              <span>Shipping</span>

              <span className="font-medium text-green-700">Free</span>
            </div>

            <hr className="border-stone-200" />

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>

              <span className="text-amber-700">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>

          <Button
            fullWidth
            className="mt-8"
            disabled={placingOrder}
            onClick={handlePlaceOrder}
          >
            {placingOrder ? "Processing Payment..." : "Place Order & Pay"}
          </Button>

          <p className="mt-4 text-center text-xs text-stone-500">
            By placing this order, you confirm that your order details are
            correct.
          </p>

          <Link
            to="/cart"
            className="mt-4 flex w-full items-center justify-center rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
          >
            Back to Cart
          </Link>
        </div>
      </section>

      {placingOrder && <Loader text="Creating your order..." />}
    </main>
  );
};

export default Checkout;






