import { useEffect, useState } from "react";

import adminService from "../../services/adminService";

import Loader from "../../components/common/Loader";

import getErrorMessage from "../../utils/errorHandler";
import toastService from "../../utils/toast";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [processingId, setProcessingId] = useState(null);

  const [processingAction, setProcessingAction] = useState("");

  const loadUsers = async () => {
    const response = await adminService.getUsers();

    setUsers(response.data || response || []);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await loadUsers();
      } catch (error) {
        toastService.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleBlockToggle = async (userId) => {
    try {
      setProcessingId(userId);
      setProcessingAction("block");

      await adminService.toggleUserBlock(userId);

      await loadUsers();

      toastService.success("User status updated successfully.");
    } catch (error) {
      toastService.error(getErrorMessage(error));
    } finally {
      setProcessingId(null);
      setProcessingAction("");
    }
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${user.name}? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(user._id);
      setProcessingAction("delete");

      await adminService.deleteUser(user._id);

      await loadUsers();

      toastService.success("User deleted successfully.");
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
    <main className="min-h-[70vh] bg-stone-50 py-8 sm:py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-bold text-stone-900">
            Manage Users
          </h1>

          <p className="mt-2 text-stone-600">
            View marketplace accounts and control user access.
          </p>
        </div>

        {!users.length ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center">
            <p className="text-lg font-semibold text-stone-900">
              No users found.
            </p>

            <p className="mt-2 text-sm text-stone-500">
              There are currently no registered users.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left">
                <thead className="bg-stone-50 text-xs uppercase text-stone-500">
                  <tr>
                    <th className="px-5 py-4">User</th>

                    <th className="px-5 py-4">Email</th>

                    <th className="px-5 py-4">Roles</th>

                    <th className="px-5 py-4">Status</th>

                    <th className="px-5 py-4">Joined</th>

                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-200">
                  {users.map((user) => {
                    const isAdmin = user.roles?.includes("admin");

                    const isProcessing = processingId === user._id;

                    return (
                      <tr key={user._id} className="hover:bg-stone-50">
                        <td className="px-5 py-4 font-semibold text-stone-900">
                          {user.name}
                        </td>

                        <td className="px-5 py-4 text-sm text-stone-600">
                          {user.email}
                        </td>

                        <td className="px-5 py-4 text-sm text-stone-600">
                          {user.roles?.join(", ") || "buyer"}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              user.isBlocked
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {user.isBlocked ? "Blocked" : "Active"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-stone-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-5 py-4">
                          {isAdmin ? (
                            <div className="text-right">
                              <span className="text-xs font-semibold text-stone-400">
                                Administrator
                              </span>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleBlockToggle(user._id)}
                                disabled={isProcessing}
                                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                  user.isBlocked
                                    ? "bg-green-700 hover:bg-green-800"
                                    : "bg-red-700 hover:bg-red-800"
                                }`}
                              >
                                {isProcessing && processingAction === "block"
                                  ? "Updating..."
                                  : user.isBlocked
                                    ? "Unblock"
                                    : "Block"}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(user)}
                                disabled={isProcessing}
                                className="rounded-lg bg-red-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isProcessing && processingAction === "delete"
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ManageUsers;
