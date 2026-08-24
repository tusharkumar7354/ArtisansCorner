import { Minus, Plus, Trash2 } from "lucide-react";
import formatCurrency from "../../utils/formatCurrency";

const CartItem = ({ item, onUpdateQuantity, onRemove, updating = false }) => {
  const image =
    item.product?.images?.[0]?.url ||
    item.product?.images?.[0] ||
    "/placeholder.png";

  const handleDecrease = () => {
    if (!item.product?.isActive || item.quantity <= 1) {
      return;
    }
    onUpdateQuantity(item.product._id, item.quantity - 1);
  };

  const handleIncrease = () => {
    if (!item.product?.isActive) {
      return;
    }
    onUpdateQuantity(item.product._id, item.quantity + 1);
  };

  const handleRemove = () => {
    onRemove(item.product._id);
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm md:flex-row">
      <img
        src={image}
        alt={item.product?.title}
        className="h-36 w-36 rounded-xl object-cover"
      />

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-stone-900">
            {item.product?.title}
          </h3>

          <p className="mt-2 text-stone-500">
            {item.product?.store?.storeName}
          </p>

          {!item.product?.isActive && (
            <p className="mt-2 text-sm font-semibold text-red-600">
              This product is currently unavailable.
            </p>
          )}

          <p className="mt-3 text-2xl font-bold text-amber-700">
            {formatCurrency(item.product?.price)}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center rounded-xl border border-stone-300">
            <button
              type="button"
              onClick={handleDecrease}
              disabled={updating || item.quantity <= 1}
              className="p-3 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus size={18} />
            </button>

            <span className="min-w-12 text-center font-semibold">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={handleIncrease}
              disabled={updating}
              className="p-3 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus size={18} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            disabled={updating}
            className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 font-medium text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={18} />

            {updating ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
