import { useEffect, useState } from "react";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import EmptyState from "../../components/common/EmptyState";
import useCart from "../../hooks/useCart";
import getErrorMessage from "../../utils/errorHandler";
import toastService from "../../utils/toast";

const Cart = () => {
  const {
    cart,
    totalAmount,
    loading,
    fetchCart,
    updateCartItem,
    removeCartItem,
    clearCart,
  } = useCart();

  const [updating, setUpdating] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    fetchCart().catch((error) => {
      toastService.error(getErrorMessage(error));
    });
  }, [fetchCart]);

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      return;
    }

    try {
      setUpdating(true);

      await updateCartItem(productId, quantity);

      toastService.success("Cart quantity updated successfully.");
    } catch (error) {
      toastService.error(getErrorMessage(error));
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      setUpdating(true);

      await removeCartItem(productId);

      toastService.success("Product removed from cart.");
    } catch (error) {
      toastService.error(getErrorMessage(error));
    } finally {
      setUpdating(false);
    }
  };

  const handleClearCart = async () => {
    try {
      setClearing(true);

      await clearCart();

      toastService.success("Cart cleared successfully.");
    } catch (error) {
      toastService.error(getErrorMessage(error));
    } finally {
      setClearing(false);
    }
  };

  if (loading && !cart) {
    return (
      <main className="page">
        <div className="container">
          <p>Loading cart...</p>
        </div>
      </main>
    );
  }

  const items = cart?.items || [];
  const canCheckout =
    items.length > 0 && items.every((item) => item.product?.isActive);

  return (
    <main className="min-h-[70vh] bg-stone-50 py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
            Your Selection
          </p>

          <h1 className="mt-2 text-4xl font-black text-stone-900">
            Shopping Cart
          </h1>
        </div>

        {items.length === 0 ? (
          <EmptyState
            title="Your Cart is Empty"
            description="Add some handmade products to your cart."
            buttonText="Continue Shopping"
            buttonLink="/products"
          />
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              {items.map((item) => (
                <CartItem
                  key={item.product._id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemove}
                  updating={updating}
                />
              ))}
            </div>

            <div className="h-fit rounded-2xl lg:sticky lg:top-24">
              <CartSummary
                totalAmount={totalAmount}
                onClearCart={handleClearCart}
                clearing={clearing}
                canCheckout={canCheckout}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;
