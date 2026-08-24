import { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import formatCurrency from "../../utils/formatCurrency";
import getErrorMessage from "../../utils/errorHandler";
import toastService from "../../utils/toast";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadProducts = async () => {
    const response = await adminService.getProducts();
    setProducts(response.data || response || []);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await loadProducts();
      } catch (error) {
        toastService.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleStatusChange = async (productId) => {
    try {
      setUpdatingId(productId);
      await adminService.updateProductStatus(productId);
      await loadProducts();
      toastService.success("Product status updated successfully.");
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-bold text-stone-900">
            Manage Products
          </h1>

          <p className="mt-2 text-stone-600">
            Review marketplace products and control their availability.
          </p>
        </div>

        {!products.length ? (
          <EmptyState
            title="No Products"
            description="There are currently no products available."
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="bg-stone-50">
                  <tr className="border-b border-stone-200">
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Product
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Seller
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Category
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Price
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Stock
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-200">
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="transition hover:bg-stone-50"
                    >
                      {/* Product */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                            {product.images?.[0]?.url ? (
                              <img
                                src={product.images[0].url}
                                alt={product.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-stone-400">
                                No Image
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[260px] truncate font-semibold text-stone-900">
                              {product.title}
                            </p>

                            <p className="mt-1 text-xs text-stone-500">
                              Reviews: {product.totalReviews ?? 0}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Seller */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-stone-800">
                          {product.seller?.name || "Unknown Seller"}
                        </p>

                        <p className="mt-1 text-xs text-stone-500">
                          {product.store?.storeName || "No Store"}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span
                          title={product.category?.name || "Uncategorized"}
                          className="inline-block max-w-[180px] truncate rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700"
                        >
                          {product.category?.name || "Uncategorized"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4 font-semibold text-stone-900">
                        {formatCurrency(product.price)}
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-4">
                        <span
                          className={`font-semibold ${
                            product.stock > 0
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            product.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          disabled={updatingId === product._id}
                          onClick={() => handleStatusChange(product._id)}
                          className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            product.isActive
                              ? "bg-red-700 hover:bg-red-800"
                              : "bg-green-700 hover:bg-green-800"
                          }`}
                        >
                          {updatingId === product._id
                            ? "Updating..."
                            : product.isActive
                              ? "Deactivate"
                              : "Activate"}
                        </button>
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

export default ManageProducts;


