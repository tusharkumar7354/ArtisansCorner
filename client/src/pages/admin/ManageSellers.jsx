import { useEffect, useState } from "react";

import adminService from "../../services/adminService";

import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

import getErrorMessage from "../../utils/errorHandler";
import toastService from "../../utils/toast";

const ManageSellers = () => {
  const [sellers, setSellers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [processingId, setProcessingId] = useState(null);

  const [processingAction, setProcessingAction] = useState("");

  const loadSellers = async () => {
    const response = await adminService.getSellers();

    setSellers(response.data || response || []);
  };

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        await loadSellers();
      } catch (error) {
        toastService.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  const handleBlockToggle = async (sellerId) => {
    try {
      setProcessingId(sellerId);
      setProcessingAction("block");

      await adminService.toggleUserBlock(sellerId);

      await loadSellers();

      toastService.success("Seller account status updated successfully.");
    } catch (error) {
      toastService.error(getErrorMessage(error));
    } finally {
      setProcessingId(null);
      setProcessingAction("");
    }
  };

  const handleDelete = async (seller) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${seller.name}'s seller account? Their store and seller products will also be removed. This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(seller._id);
      setProcessingAction("delete");

      await adminService.deleteUser(seller._id);

      await loadSellers();

      toastService.success("Seller deleted successfully.");
    } catch (error) {
      toastService.error(getErrorMessage(error));
    } finally {
      setProcessingId(null);
      setProcessingAction("");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <main className="min-h-[70vh] bg-stone-50 py-8 sm:py-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-1">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-bold text-stone-900">
            Manage Sellers
          </h1>

          <p className="mt-2 text-stone-600">
            Monitor sellers and their stores on Artisan&apos;s Corner.
          </p>
        </div>

        {!sellers.length ? (
          <EmptyState
            title="No Sellers"
            description="No sellers are currently available."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sellers.map((seller) => {
              const store = seller.store;

              const isStoreActive = store?.isActive ?? false;

              const isProcessing = processingId === seller._id;

              return (
                <article
                  key={seller._id}
                  className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
                >
                  {/* Seller Header */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg font-bold text-amber-800">
                      {seller.name?.charAt(0)?.toUpperCase() || "S"}
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-bold text-stone-900">
                        {seller.name}
                      </h2>

                      <p className="mt-1 truncate text-sm text-stone-500">
                        {seller.email}
                      </p>
                    </div>
                  </div>

                  {/* Store */}
                  <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      Store Name
                    </p>

                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p
                        className={`min-w-0 text-base font-semibold ${
                          store ? "text-stone-900" : "text-stone-400"
                        }`}
                      >
                        {store?.storeName || "No Store"}
                      </p>

                      {store && (
                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                            isStoreActive
                              ? "bg-green-100 text-green-700"
                              : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {isStoreActive ? "Active" : "Inactive"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Roles */}
                  <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      Roles
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {(seller.roles || []).map((role) => (
                        <span
                          key={role}
                          className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium capitalize text-stone-700"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Account + Actions */}
                  <div className="mt-6 flex items-end justify-between gap-4 border-t border-stone-100 pt-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                        Account
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            seller.isBlocked ? "bg-red-600" : "bg-green-600"
                          }`}
                        />

                        <span
                          className={`text-sm font-semibold ${
                            seller.isBlocked ? "text-red-700" : "text-green-700"
                          }`}
                        >
                          {seller.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleBlockToggle(seller._id)}
                        className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          seller.isBlocked
                            ? "bg-green-700 hover:bg-green-800"
                            : "bg-red-700 hover:bg-red-800"
                        }`}
                      >
                        {isProcessing && processingAction === "block"
                          ? "Updating..."
                          : seller.isBlocked
                            ? "Unblock"
                            : "Block"}
                      </button>

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleDelete(seller)}
                        className="rounded-lg bg-red-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isProcessing && processingAction === "delete"
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default ManageSellers;
