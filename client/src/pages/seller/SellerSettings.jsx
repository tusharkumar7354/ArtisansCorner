import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import sellerService from "../../services/sellerService";
import useAuth from "../../hooks/useAuth";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import formatDate from "../../utils/formatDate";
import getErrorMessage from "../../utils/errorHandler";
import toastService from "../../utils/toast";

const SellerSettings = () => {
  const navigate = useNavigate();
  const { fetchProfile } = useAuth();

  const [store, setStore] = useState(null);
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const loadStore = async () => {
      try {
        setLoading(true);

        const response = await sellerService.getStore();
        const storeData = response.data || response;

        setStore(storeData);
        setStoreName(storeData.storeName || "");
        setDescription(storeData.description || "");
        setLogoPreview(storeData.logo || "");
      } catch (error) {
        toastService.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    loadStore();
  }, []);

  useEffect(() => {
    return () => {
      if (logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      event.target.value = "";
      toastService.error("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      event.target.value = "";
      toastService.error("Logo image must be smaller than 5 MB.");
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!storeName.trim()) {
      toastService.error("Store name is required.");
      return;
    }

    if (storeName.trim().length < 3) {
      toastService.error("Store name must be at least 3 characters.");
      return;
    }

    if (!description.trim()) {
      toastService.error("Store description is required.");
      return;
    }

    if (description.trim().length < 10) {
      toastService.error("Store description must be at least 10 characters.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("storeName", storeName.trim());
      formData.append("description", description.trim());

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const response = await sellerService.updateStore(formData);
      const updatedStore = response.data || response;

      setStore(updatedStore);
      setStoreName(updatedStore.storeName || "");
      setDescription(updatedStore.description || "");
      setLogoPreview(updatedStore.logo || "");
      setLogoFile(null);

      await fetchProfile();

      toastService.success("Store settings updated successfully.");
    } catch (error) {
      toastService.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleCloseStore = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to close your store? Your products will become inactive.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setClosing(true);

      await sellerService.closeStore();
      await fetchProfile();

      toastService.success("Your store has been closed successfully.");

      navigate("/become-seller");
    } catch (error) {
      toastService.error(getErrorMessage(error));
    } finally {
      setClosing(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-stone-50 py-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-stone-600">Loading store settings...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-stone-50 py-8 sm:py-2">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
            Store Management
          </p>

          <h1 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
            Store Settings
          </h1>

          <p className="mt-2 text-stone-600">
            Manage your artisan store name, description and logo.
          </p>
        </div>

        <section className="mb-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Store Status</h2>

              <p className="mt-1 text-sm text-stone-600">
                Your store is currently {store?.isActive ? "active" : "closed"}.
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
                store?.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {store?.isActive ? "Active" : "Closed"}
            </span>
          </div>
        </section>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="space-y-6">
            <div>
              <label className="mb-3 block font-medium text-stone-800">
                Store Logo
              </label>

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="h-28 w-28 overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Store logo preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-3 text-center text-xs text-stone-400">
                      No logo
                    </div>
                  )}
                </div>

                <div>
                  <input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="block w-full text-sm text-stone-600"
                  />

                  <p className="mt-2 text-xs text-stone-500">
                    Image only. Maximum size: 5 MB.
                  </p>
                </div>
              </div>
            </div>

            <Input
              label="Store Name"
              value={storeName}
              onChange={(event) => setStoreName(event.target.value)}
            />

            <div>
              <label
                htmlFor="description"
                className="mb-2 block font-medium text-stone-800"
              >
                Description
              </label>

              <textarea
                id="description"
                rows={6}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="w-full rounded-xl border border-stone-300 p-4 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                placeholder="Tell customers about your artisan store."
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" loading={saving}>
                Save Changes
              </Button>
            </div>
          </div>
        </form>

        {store?.isActive && (
          <section className="mt-6 rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-red-700">Close Store</h2>

            <p className="mt-3 text-sm leading-6 text-stone-600">
              Closing your store will deactivate all your products and
              customers will no longer be able to purchase them.
            </p>

            <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              Reopening your store will not automatically reactivate your
              products.
            </div>

            <Button
              type="button"
              variant="danger"
              loading={closing}
              onClick={handleCloseStore}
              className="mt-6"
            >
              Close Store
            </Button>
          </section>
        )}

        {store?.updatedAt && (
          <p className="mt-5 text-xs text-stone-500">
            Last updated: {formatDate(store.updatedAt)}
          </p>
        )}
      </div>
    </main>
  );
};

export default SellerSettings;





