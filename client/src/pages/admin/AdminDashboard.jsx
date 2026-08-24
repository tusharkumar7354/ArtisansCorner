import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Store, Package, ShoppingBag } from "lucide-react";
import adminService from "../../services/adminService";
import Loader from "../../components/common/Loader";
import getErrorMessage from "../../utils/errorHandler";
import formatCurrency from "../../utils/formatCurrency";
import toastService from "../../utils/toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalStores: 0,
    paidOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await adminService.getDashboard();
        setStats(response.data || {});
      } catch (error) {
        toastService.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers ?? 0,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Seller Stores",
      value: stats.totalStores ?? 0,
      icon: Store,
      color: "text-green-600",
    },
    {
      title: "Products",
      value: stats.totalProducts ?? 0,
      icon: Package,
      color: "text-amber-700",
    },
    {
      title: "Orders",
      value: stats.totalOrders ?? 0,
      icon: ShoppingBag,
      color: "text-purple-600",
    },
  ];

  return (
    <main className="space-y-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
          Administration
        </p>
        <h1 className="mt-2 text-4xl font-black">Admin Dashboard</h1>
        <p className="mt-2 text-stone-600">
          Monitor and manage Artisan&apos;s Corner.
        </p>
      </div>
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-3xl bg-white p-6 shadow-sm"
            >
              <Icon size={38} className={card.color} />
              <p className="mt-5 text-stone-500">{card.title}</p>
              <h2 className="mt-2 text-4xl font-black">{card.value}</h2>
            </div>
          );
        })}
      </section>
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-stone-500">Paid Orders</p>
          <h2 className="mt-2 text-3xl font-black">{stats.paidOrders ?? 0}</h2>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-stone-500">Pending Orders</p>
          <h2 className="mt-2 text-3xl font-black">
            {stats.pendingOrders ?? 0}
          </h2>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-stone-500">Marketplace Revenue</p>
          <h2 className="mt-2 text-3xl font-black">
            {formatCurrency(stats.totalRevenue ?? 0)}
          </h2>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-stone-900">Management</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            to="/admin/users"
            title="Manage Users"
            text="View, block and unblock marketplace users."
          />
          <ActionCard
            to="/admin/sellers"
            title="Manage Sellers"
            text="Monitor sellers and seller account status."
          />
          <ActionCard
            to="/admin/products"
            title="Manage Products"
            text="Review and moderate marketplace products."
          />
          <ActionCard
            to="/admin/categories"
            title="Manage Categories"
            text="Create and manage product categories."
          />
          <ActionCard
            to="/admin/orders"
            title="Manage Orders"
            text="Monitor marketplace orders and status."
          />
        </div>
      </section>
    </main>
  );
};

const ActionCard = ({ to, title, text }) => (
  <Link
    to={to}
    className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-md"
  >
    <h3 className="font-bold text-stone-900">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-stone-500">{text}</p>
    <p className="mt-4 text-sm font-semibold text-amber-800">Open →</p>
  </Link>
);

export default AdminDashboard;


