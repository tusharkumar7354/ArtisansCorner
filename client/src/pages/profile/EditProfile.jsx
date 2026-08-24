import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import ErrorMessage from "../../components/common/ErrorMessage";
import authService from "../../services/authService";
import getErrorMessage from "../../utils/errorHandler";
import toastService from "../../utils/toast";

const isValidName = (value) => {
  const name = value.trim();

  if (!name) {
    return false;
  }

  return /^[\p{L}]+(?:[ .'-][\p{L}]+)*$/u.test(name);
};

const isValidPhone = (value) => {
  return /^[6-9]\d{9}$/.test(value.trim());
};

const isValidPincode = (value) => {
  return /^\d{6}$/.test(value.trim());
};

const isValidAddress = (value) => {
  const address = value.trim();

  return address.length >= 5 && address.length <= 200;
};

const isValidCityOrState = (value) => {
  const location = value.trim();

  if (!location) {
    return false;
  }

  return /^[\p{L}]+(?:[ .'-][\p{L}]+)*$/u.test(location);
};

const ProfileForm = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchProfile } = useAuth();

  const [name, setName] = useState(user.name || "");

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user.shippingAddress?.fullName || user.name || "",
    phone: user.shippingAddress?.phone || "",
    address: user.shippingAddress?.address || "",
    city: user.shippingAddress?.city || "",
    state: user.shippingAddress?.state || "",
    pincode: user.shippingAddress?.pincode || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddressChange = (event) => {
    const { name, value } = event.target;

    let updatedValue = value;

    // Phone: only numbers, maximum 10 digits
    if (name === "phone") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    // Pincode: only numbers, maximum 6 digits
    if (name === "pincode") {
      updatedValue = value.replace(/\D/g, "").slice(0, 6);
    }

    setShippingAddress((previous) => ({
      ...previous,
      [name]: updatedValue,
    }));
  };

  const validateForm = () => {
    const trimmedName = name.trim();

    const fullName = shippingAddress.fullName.trim();
    const phone = shippingAddress.phone.trim();
    const address = shippingAddress.address.trim();
    const city = shippingAddress.city.trim();
    const state = shippingAddress.state.trim();
    const pincode = shippingAddress.pincode.trim();

    // Profile name
    if (!isValidName(trimmedName)) {
      return "Please enter a valid full name.";
    }

    // Shipping full name
    if (!isValidName(fullName)) {
      return "Please enter a valid shipping full name.";
    }

    // Phone
    if (!isValidPhone(phone)) {
      return "Phone number must be exactly 10 digits and start with 6, 7, 8 or 9.";
    }

    // Address
    if (!isValidAddress(address)) {
      return "Address must be between 5 and 200 characters.";
    }

    // City
    if (!isValidCityOrState(city)) {
      return "Please enter a valid city.";
    }

    // State
    if (!isValidCityOrState(state)) {
      return "Please enter a valid state.";
    }

    // Pincode
    if (!isValidPincode(pincode)) {
      return "Pincode must be exactly 6 digits.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      toastService.error(validationError);
      return;
    }

    const trimmedName = name.trim();

    const addressPayload = {
      fullName: shippingAddress.fullName.trim(),
      phone: shippingAddress.phone.trim(),
      address: shippingAddress.address.trim(),
      city: shippingAddress.city.trim(),
      state: shippingAddress.state.trim(),
      pincode: shippingAddress.pincode.trim(),
    };

    try {
      setLoading(true);
      setError("");

      // Update profile name
      await authService.updateProfile({
        name: trimmedName,
      });

      // Update shipping address
      await authService.updateShippingAddress(addressPayload);

      // Refresh logged-in user
      await fetchProfile();

      toastService.success(
        "Profile and shipping address updated successfully.",
      );

      // If user came from checkout, send them back there.
      if (location.state?.from === "/checkout") {
        navigate("/checkout", {
          replace: true,
        });
      } else {
        navigate("/profile");
      }
    } catch (error) {
      const message = getErrorMessage(error);

      setError(message);
      toastService.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      {/* Page Header */}
      <section className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
          Account
        </p>

        <h1 className="mt-2 text-4xl font-bold text-stone-900">Edit Profile</h1>

        <p className="mt-2 text-stone-600">
          Update your account and shipping information.
        </p>
      </section>

      {/* Checkout Message */}
      {location.state?.message && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800">
          {location.state.message}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-3xl bg-white p-8 shadow-sm"
      >
        {/* =========================
            ACCOUNT INFORMATION
        ========================== */}
        <section>
          <h2 className="text-2xl font-bold text-stone-900">
            Account Information
          </h2>

          <div className="mt-6 space-y-5">
            <Input
              label="Full Name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              maxLength={50}
            />

            <Input label="Email" value={user.email || ""} disabled />
          </div>
        </section>

        {/* =========================
            SHIPPING ADDRESS
        ========================== */}
        <section className="border-t border-stone-200 pt-8">
          <h2 className="text-2xl font-bold text-stone-900">
            Shipping Address
          </h2>

          <p className="mt-2 text-stone-600">
            This address will be used when you place an order.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {/* Full Name */}
            <Input
              label="Full Name"
              name="fullName"
              value={shippingAddress.fullName}
              onChange={handleAddressChange}
              required
              maxLength={50}
            />

            {/* Phone */}
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              inputMode="numeric"
              value={shippingAddress.phone}
              onChange={handleAddressChange}
              required
              maxLength={10}
              autoComplete="tel"
            />

            {/* Address */}
            <div className="md:col-span-2">
              <label
                htmlFor="address"
                className="mb-2 block text-sm font-semibold text-stone-800"
              >
                Address
              </label>

              <textarea
                id="address"
                name="address"
                value={shippingAddress.address}
                onChange={handleAddressChange}
                required
                minLength={5}
                maxLength={200}
                rows={4}
                placeholder="House number, street, area"
                className="w-full resize-none rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            {/* City */}
            <Input
              label="City"
              name="city"
              value={shippingAddress.city}
              onChange={handleAddressChange}
              required
              maxLength={50}
            />

            {/* State */}
            <Input
              label="State"
              name="state"
              value={shippingAddress.state}
              onChange={handleAddressChange}
              required
              maxLength={50}
            />

            {/* Pincode */}
            <Input
              label="Pincode"
              name="pincode"
              type="text"
              inputMode="numeric"
              value={shippingAddress.pincode}
              onChange={handleAddressChange}
              required
              maxLength={6}
              autoComplete="postal-code"
            />
          </div>
        </section>

        {/* =========================
            SUBMIT
        ========================== */}
        <div className="border-t border-stone-200 pt-6">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </main>
  );
};

const EditProfile = () => {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-stone-600">Loading profile...</p>
      </main>
    );
  }

  return <ProfileForm key={user._id || user.id} user={user} />;
};

export default EditProfile;
