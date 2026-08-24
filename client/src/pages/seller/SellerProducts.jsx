import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import Button from "../../components/common/Button";
import productService from "../../services/productService";
import formatCurrency from "../../utils/formatCurrency";
import getErrorMessage from "../../utils/errorHandler";
import toastService from "../../utils/toast";

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await productService.getSellerProducts();

        setProducts(response.data || []);
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this product?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(productId);

      await productService.deleteProduct(productId);

      setProducts((previousProducts) =>
        previousProducts.filter((product) => product._id !== productId),
      );

      toastService.success("Product deleted successfully.");
    } catch (error) {
      toastService.error(getErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!products.length) {
    return (
      <EmptyState
        title="No Products"
        description="Create your first product."
        action={
          <Link to="/seller/create-product">
            <Button>Add Product</Button>
          </Link>
        }
      />
    );
  }

  return (
    <main className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black">My Products</h1>
          <p className="mt-2 text-stone-600">Manage your handmade products.</p>
        </div>

        <Link to="/seller/create-product">
          <Button>Add Product</Button>
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <article
            key={product._id}
            className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
          >
            <div className="aspect-square bg-stone-100">
              {product.images?.[0]?.url ? (
                <img
                  src={product.images[0].url}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-stone-400">
                  No Image
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="line-clamp-2 text-lg font-bold text-stone-900">
                  {product.title}
                </h2>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    product.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {product.category?.name && (
                <p className="mt-2 text-sm text-stone-500">
                  {product.category.name}
                </p>
              )}

              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-amber-800">
                  {formatCurrency(product.price)}
                </span>

                <span
                  className={`text-sm font-medium ${
                    product.stock > 0 ? "text-stone-600" : "text-red-600"
                  }`}
                >
                  {product.stock > 0
                    ? `Stock: ${product.stock}`
                    : "Out of Stock"}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-stone-200 pt-4">
                <Link
                  to={`/seller/edit-product/${product._id}`}
                  className="rounded-lg border border-amber-700 px-3 py-2 text-center text-sm font-semibold text-amber-800 transition hover:bg-amber-50"
                >
                  Edit
                </Link>

                <button
                  type="button"
                  onClick={() => handleDelete(product._id)}
                  disabled={deletingId === product._id}
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                >
                  {deletingId === product._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
};

export default SellerProducts;

