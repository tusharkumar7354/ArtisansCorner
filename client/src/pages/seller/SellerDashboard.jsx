import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingBag, IndianRupee, Star } from "lucide-react";
import productService from "../../services/productService";
import sellerService from "../../services/sellerService";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import formatCurrency from "../../utils/formatCurrency";
import getErrorMessage from "../../utils/errorHandler";

const SellerDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [productsResponse, analyticsResponse] = await Promise.all([
          productService.getMyProducts(),
          sellerService.getSellerAnalytics(),
        ]);

        const products =
          productsResponse.data?.products || productsResponse.data || [];

        const analytics = analyticsResponse.data || analyticsResponse;

        const averageRating =
          products.length > 0
            ? products.reduce(
                (total, product) =>
                  total + Number(product.averageRating || 0),
                0,
              ) / products.length
            : 0;

        setStats({
          totalProducts: products.length,
          totalOrders: analytics.totalSales || 0,
          totalRevenue: analytics.totalEarnings || 0,
          averageRating,
        });
      } catch (error) {
        console.error("Seller Dashboard Error:", error);
        setError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <Loader text="Loading seller dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <main className="min-h-[70vh] bg-stone-50 py-4 sm:py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
            Seller Centre
          </p>
          <h1 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
            Seller Dashboard
          </h1>
          <p className="mt-2 text-stone-600">
            Manage your products, orders and store performance.
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <Package size={40} className="text-amber-700" />
            <p className="mt-5 text-sm font-medium text-stone-500">Products</p>
            <h2 className="mt-2 text-4xl font-black text-stone-900">
              {stats.totalProducts}
            </h2>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <ShoppingBag size={40} className="text-blue-600" />
            <p className="mt-5 text-sm font-medium text-stone-500">Orders</p>
            <h2 className="mt-2 text-4xl font-black text-stone-900">
              {stats.totalOrders}
            </h2>
          </div>

          <div className="min-w-0 rounded-3xl bg-white p-6 shadow-sm">
            <IndianRupee size={40} className="text-green-600" />
            <p className="mt-5 text-stone-500">Revenue</p>
            <h2 className="mt-2 whitespace-nowrap text-[clamp(1.15rem,2.2vw,2.25rem)] font-black leading-tight text-stone-900">
              {formatCurrency(stats.totalRevenue)}
            </h2>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <Star size={40} className="text-yellow-500" />
            <p className="mt-5 text-sm font-medium text-stone-500">Rating</p>
            <h2 className="mt-2 text-4xl font-black text-stone-900">
              {stats.averageRating.toFixed(1)}
            </h2>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-stone-900">
              Seller Actions
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Quickly access your seller tools.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/seller/products"
              className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-md"
            >
              <h3 className="font-semibold text-stone-900">My Products</h3>
              <p className="mt-2 text-sm text-stone-500">
                View, edit and remove your products.
              </p>
            </Link>

            <Link
              to="/seller/create-product"
              className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-md"
            >
              <h3 className="font-semibold text-stone-900">Create Product</h3>
              <p className="mt-2 text-sm text-stone-500">
                Add a new handmade product to your store.
              </p>
            </Link>

            <Link
              to="/seller/orders"
              className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-md"
            >
              <h3 className="font-semibold text-stone-900">Customer Orders</h3>
              <p className="mt-2 text-sm text-stone-500">
                Process and update customer orders.
              </p>
            </Link>

            <Link
              to="/seller/sales"
              className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-md"
            >
              <h3 className="font-semibold text-stone-900">Sales History</h3>
              <p className="mt-2 text-sm text-stone-500">
                Review your sales and earnings.
              </p>
            </Link>

            <Link
              to="/seller/settings"
              className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-md"
            >
              <h3 className="font-semibold text-stone-900">Store Settings</h3>
              <p className="mt-2 text-sm text-stone-500">
                Manage your artisan store.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SellerDashboard;



