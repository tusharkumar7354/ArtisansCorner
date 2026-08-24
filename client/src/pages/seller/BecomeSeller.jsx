import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store, CheckCircle2, AlertCircle } from "lucide-react";

import sellerService from "../../services/sellerService";
import getErrorMessage from "../../utils/errorHandler";
import toastService from "../../utils/toast";
import useAuth from "../../hooks/useAuth";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const BecomeSeller = () => {
  const navigate = useNavigate();
  const { user, fetchProfile } = useAuth();

  const [formData, setFormData] = useState({
    storeName: "",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const hasSellerRole = user?.roles?.includes("seller");
  const isClosedSeller = hasSellerRole && !user?.isSeller;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleReopenStore = async () => {
    try {
      setSubmitting(true);

      await sellerService.reopenStore();
      await fetchProfile();

      toastService.success("Your store has been reopened successfully.");

      navigate("/seller/dashboard");
    } catch (error) {
      toastService.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const storeName = formData.storeName.trim();
    const description = formData.description.trim();

    if (!storeName) {
      toastService.error("Store name is required.");
      return;
    }

    if (storeName.length < 3) {
      toastService.error("Store name must be at least 3 characters.");
      return;
    }

    if (storeName.length > 100) {
      toastService.error("Store name cannot exceed 100 characters.");
      return;
    }

    if (!/^[\p{L}\p{N}][\p{L}\p{N} .&'()-]*$/u.test(storeName)) {
      toastService.error("Store name contains invalid characters.");
      return;
    }

    if (!description) {
      toastService.error("Store description is required.");
      return;
    }

    if (description.length < 10) {
      toastService.error("Store description must be at least 10 characters.");
      return;
    }

    if (description.length > 500) {
      toastService.error("Store description cannot exceed 500 characters.");
      return;
    }

    try {
      setSubmitting(true);

      await sellerService.becomeSeller({
        storeName,
        description,
      });

      await fetchProfile();

      toastService.success("Your seller store has been created successfully.");

      navigate("/seller/dashboard");
    } catch (error) {
      toastService.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  /*
   * Already active seller
   */
  if (user?.isSeller) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-stone-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center">
          <section className="w-full rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <Store size={30} />
            </div>

            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
              Seller Account
            </p>

            <h1 className="mt-2 text-3xl font-bold text-stone-900">
              Your seller account is already active.
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-stone-600">
              You already have an active seller store. Open your seller
              dashboard to manage your store, products and orders.
            </p>

            <div className="mt-7">
              <Button
                type="button"
                onClick={() => navigate("/seller/dashboard")}
              >
                Go to Seller Dashboard
              </Button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  /*
   * Seller whose store is closed
   */
  if (isClosedSeller) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-stone-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <section className="w-full overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl">
            <div className="bg-gradient-to-br from-amber-800 to-amber-700 px-6 py-10 text-center text-white sm:px-10">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/15 shadow-lg ring-1 ring-white/30">
                <Store size={38} />
              </div>

              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-amber-100">
                Seller Centre
              </p>

              <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                Reopen Your Store
              </h1>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-amber-50 sm:text-base">
                Your store is currently closed. Reopen it to start selling your
                handmade products again.
              </p>
            </div>

            <div className="px-6 py-8 sm:px-10 sm:py-10">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-700 text-white">
                    <AlertCircle size={20} />
                  </div>

                  <div>
                    <h2 className="font-bold text-stone-900">
                      Your store is currently closed
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-stone-600">
                      Reopening your store will restore your active seller
                      account and make your previously active products available
                      to customers again.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-lg font-bold text-stone-900">
                  What happens when you reopen?
                </h2>

                <div className="mt-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={22}
                      className="mt-0.5 shrink-0 text-green-600"
                    />

                    <p className="text-sm leading-6 text-stone-600">
                      Your seller account becomes active again.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={22}
                      className="mt-0.5 shrink-0 text-green-600"
                    />

                    <p className="text-sm leading-6 text-stone-600">
                      Products that were active before the store was closed
                      become visible to customers again.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={22}
                      className="mt-0.5 shrink-0 text-green-600"
                    />

                    <p className="text-sm leading-6 text-stone-600">
                      Your store profile, products and seller data remain saved.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 border-t border-stone-200 pt-6">
                <Button
                  type="button"
                  onClick={handleReopenStore}
                  disabled={submitting}
                  fullWidth
                >
                  <Store size={19} />
                  {submitting ? "Reopening Store..." : "Reopen Store"}
                </Button>

                <p className="mt-3 text-center text-xs leading-5 text-stone-500">
                  Your existing store data will be preserved.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  /*
   * New seller registration
   */
  return (
    <main className="mx-auto max-w-[1120px] px-4 py-[54px] sm:px-6">
      <section>
        <h1 className="text-[20px] font-normal leading-7 text-stone-900">
          Become a Seller
        </h1>

        <p className="mt-1 text-[20px] font-normal leading-7 text-stone-900">
          Create your artisan store and start selling your handmade products.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="mt-2" noValidate>
        {/* Store Name */}
        <div>
          <label
            htmlFor="storeName"
            className="mb-1 block text-[16px] font-semibold text-stone-900"
          >
            Store Name
          </label>

          <Input
            name="storeName"
            value={formData.storeName}
            onChange={handleChange}
            placeholder="Enter store name"
            required
            minLength={3}
            maxLength={100}
          />
        </div>

        {/* Store Description */}
        <div className="mt-7">
          <label
            htmlFor="description"
            className="mb-1 block text-[16px] font-semibold text-stone-900"
          >
            Store Description
          </label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell customers about your store"
            required
            minLength={10}
            maxLength={500}
            rows={6}
            className="min-h-[182px] w-full resize-y rounded-[15px] border border-stone-300 bg-white px-5 py-4 text-[18px] text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:ring-1 focus:ring-amber-700"
          />
        </div>

        {/* Submit */}
        <div className="mt-8">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating Store..." : "Become Seller"}
          </Button>
        </div>
      </form>
    </main>
  );
};

export default BecomeSeller;
