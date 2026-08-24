import { Link } from "react-router-dom";
import Button from "../common/Button";
import formatCurrency from "../../utils/formatCurrency";

const CartSummary = ({
  totalAmount,
  onClearCart,
  clearing = false,
  canCheckout = true,
}) => {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-stone-900">Order Summary</h2>

      <div className="mt-6 space-y-4">
        <div className="flex justify-between text-stone-600">
          <span>Subtotal</span>

          <strong className="text-stone-900">
            {formatCurrency(totalAmount)}
          </strong>
        </div>

        <div className="flex justify-between text-stone-600">
          <span>Shipping</span>

          <strong className="text-green-700">Free</strong>
        </div>

        <hr className="border-stone-200" />

        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>

          <span className="text-amber-700">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      {canCheckout ? (
        <Link to="/checkout" className="block">
          <Button fullWidth className="mt-8">
            Proceed to Checkout
          </Button>
        </Link>
      ) : (
        <Button fullWidth className="mt-8" disabled>
          Remove unavailable items first
        </Button>
      )}

      {onClearCart && (
        <Button
          fullWidth
          variant="primary"
          className="mt-3"
          disabled={clearing}
          onClick={onClearCart}
        >
          {clearing ? "Clearing..." : "Clear Cart"}
        </Button>
      )}
    </div>
  );
};

export default CartSummary;



