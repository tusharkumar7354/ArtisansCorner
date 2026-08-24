import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import sellerService from "../../services/sellerService";
import formatCurrency from "../../utils/formatCurrency";
import formatDate from "../../utils/formatDate";
import getErrorMessage from "../../utils/errorHandler";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

const SalesHistory = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await sellerService.getSellerAnalytics();

        setAnalytics(response.data || response);
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-stone-50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-stone-600">Loading sales history...</p>
        </div>
      </main>
    );
  }

  const sales = analytics?.salesHistory || [];

  const chartData = {
    labels: sales.map((sale) => formatDate(sale.createdAt)),

    datasets: [
      {
        label: "Gross Sales",
        data: sales.map((sale) => Number(sale.grossAmount || 0)),
        tension: 0.3,
      },
      {
        label: "Your Earnings",
        data: sales.map((sale) => Number(sale.earnings || 0)),
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top",
      },

      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${formatCurrency(context.raw)}`,
        },
      },
    },

    scales: {
      y: {
        beginAtZero: true,

        ticks: {
          callback: (value) => formatCurrency(value),
        },
      },
    },
  };

  return (
    <main className="min-h-[70vh] bg-stone-50 py-8 sm:py-2">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
            Seller Analytics
          </p>

          <h1 className="mt-2 text-3xl font-bold text-stone-900">
            Sales & Earnings
          </h1>

          <p className="mt-2 text-stone-600">
            Track your sales, platform fees and earnings from paid orders.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!error && analytics && (
          <>
            {/* Statistics */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <StatCard
                title="Gross Sales"
                value={formatCurrency(analytics.totalGrossSales || 0)}
              />

              <StatCard
                title="Platform Fee"
                value={formatCurrency(analytics.totalPlatformFee || 0)}
              />

              <StatCard
                title="Your Earnings"
                value={formatCurrency(analytics.totalEarnings || 0)}
                highlight
              />

              <StatCard title="Total Sales" value={analytics.totalSales || 0} />

              <StatCard
                title="Items Sold"
                value={analytics.totalItemsSold || 0}
              />
            </section>

            {/* Sales Chart */}
            <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-stone-900">
                  Sales Performance
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  Gross sales compared with your actual earnings.
                </p>
              </div>

              {sales.length === 0 ? (
                <div className="flex min-h-[320px] items-center justify-center">
                  <div className="text-center">
                    <p className="font-semibold text-stone-800">
                      No sales data available.
                    </p>

                    <p className="mt-1 text-sm text-stone-500">
                      Completed paid orders will appear in the chart.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-[350px]">
                  <Line data={chartData} options={chartOptions} />
                </div>
              )}
            </section>

            {/* Sales History */}
            <section className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              <div className="border-b border-stone-200 p-5 sm:p-6">
                <h2 className="text-xl font-bold text-stone-900">
                  Sales History
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  Earnings recorded from successfully paid orders.
                </p>
              </div>

              {sales.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="font-semibold text-stone-800">
                    No completed sales yet.
                  </p>

                  <p className="mt-1 text-sm text-stone-500">
                    Paid customer orders will appear here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] text-left">
                    <thead className="bg-stone-50 text-xs uppercase text-stone-500">
                      <tr>
                        <th className="px-5 py-4">Order</th>
                        <th className="px-5 py-4">Date</th>
                        <th className="px-5 py-4">Items</th>
                        <th className="px-5 py-4">Gross</th>
                        <th className="px-5 py-4">Fee</th>
                        <th className="px-5 py-4">Earnings</th>
                        <th className="px-5 py-4">Status</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-stone-200">
                      {sales.map((sale) => (
                        <tr key={sale.orderId} className="hover:bg-stone-50">
                          <td className="px-5 py-4">
                            <p className="font-semibold text-stone-900">
                              {sale.orderNumber ||
                                `#${sale.orderId?.slice(-8).toUpperCase()}`}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-sm text-stone-600">
                            {formatDate(sale.createdAt)}
                          </td>

                          <td className="px-5 py-4 text-sm text-stone-700">
                            {sale.itemsSold}
                          </td>

                          <td className="px-5 py-4 font-medium text-stone-800">
                            {formatCurrency(sale.grossAmount)}
                          </td>

                          <td className="px-5 py-4 text-sm text-red-600">
                            -{formatCurrency(sale.platformFee)}
                          </td>

                          <td className="px-5 py-4 font-bold text-green-700">
                            {formatCurrency(sale.earnings)}
                          </td>

                          <td className="px-5 py-4">
                            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                              {sale.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
};

const StatCard = ({ title, value, highlight = false }) => (
  <div
    className={`rounded-2xl border p-5 shadow-sm ${
      highlight ? "border-green-200 bg-green-50" : "border-stone-200 bg-white"
    }`}
  >
    <p className="text-sm font-medium text-stone-500">{title}</p>

    <p
      className={`mt-2 text-2xl font-bold ${
        highlight ? "text-green-700" : "text-stone-900"
      }`}
    >
      {value}
    </p>
  </div>
);

export default SalesHistory;
