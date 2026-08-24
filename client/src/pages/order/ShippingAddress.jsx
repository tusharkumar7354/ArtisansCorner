import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import authService from "../../services/authService";
import Button from "../../components/common/Button";
import ErrorMessage from "../../components/common/ErrorMessage";
import getErrorMessage from "../../utils/errorHandler";
import toastService from "../../utils/toast";
import {
  isAddress,
  isCityOrState,
  isPersonName,
  isPhone,
  isPincode,
} from "../../utils/validators";

const ShippingAddress = () => {
  const navigate = useNavigate();
  const { user, fetchProfile } = useAuth();

  const existingAddress = user?.shippingAddress || {};

  const [formData, setFormData] = useState({
    fullName: existingAddress.fullName || user?.name || "",
    phone: existingAddress.phone || "",
    address: existingAddress.address || "",
    city: existingAddress.city || "",
    state: existingAddress.state || "",
    pincode: existingAddress.pincode || "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    let updatedValue = value;

    if (name === "phone") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    if (name === "pincode") {
      updatedValue = value.replace(/\D/g, "").slice(0, 6);
    }

    setFormData((previous) => ({
      ...previous,
      [name]: updatedValue,
    }));
  };

  const validateForm = () => {
    const fullName = formData.fullName.trim();
    const phone = formData.phone.trim();
    const address = formData.address.trim();
    const city = formData.city.trim();
    const state = formData.state.trim();
    const pincode = formData.pincode.trim();

    if (!isPersonName(fullName)) {
      return "Please enter a valid full name.";
    }

    if (!isPhone(phone)) {
      return "Phone number must contain exactly 10 digits and start with 6, 7, 8 or 9.";
    }

    if (!isAddress(address)) {
      return "Address must be between 5 and 200 characters.";
    }

    if (!isCityOrState(city)) {
      return "Please enter a valid city.";
    }

    if (!isCityOrState(state)) {
      return "Please enter a valid state.";
    }

    if (!isPincode(pincode)) {
      return "Pincode must contain exactly 6 digits.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      setSuccess("");
      toastService.error(validationError);
      return;
    }

    const payload = {
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim(),
    };

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await authService.updateShippingAddress(payload);

      if (fetchProfile) {
        await fetchProfile();
      }

      setSuccess("Shipping address saved successfully.");
      toastService.success("Shipping address saved successfully.");
    } catch (error) {
      const message = getErrorMessage(error);

      setError(message);
      toastService.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <section className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
          Account
        </p>

        <h1 className="mt-2 text-4xl font-bold text-stone-900">
          Shipping Address
        </h1>

        <p className="mt-2 text-stone-600">
          Add your delivery address before placing an order.
        </p>
      </section>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-green-700">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-semibold text-stone-800">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              maxLength={50}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-stone-800">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              maxLength={10}
              inputMode="numeric"
              autoComplete="tel"
              placeholder="Enter 10-digit phone number"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block font-semibold text-stone-800">
              Address
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              minLength={5}
              maxLength={200}
              rows={4}
              placeholder="House number, street, area"
              className="w-full resize-none rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-stone-800">
              City
            </label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              maxLength={50}
              placeholder="Enter city"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-stone-800">
              State
            </label>

            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              maxLength={50}
              placeholder="Enter state"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-stone-800">
              Pincode
            </label>

            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
              maxLength={6}
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="Enter 6-digit pincode"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Address"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </main>
  );
};

export default ShippingAddress;
