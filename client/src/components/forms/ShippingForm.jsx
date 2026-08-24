import { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import toastService from "../../utils/toast";

const ShippingForm = ({ initialValues = {}, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    fullName: initialValues.fullName || "",
    phone: initialValues.phone || "",
    address: initialValues.address || "",
    city: initialValues.city || "",
    state: initialValues.state || "",
    postalCode: initialValues.postalCode || "",
    country: initialValues.country || "",
  });

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await onSubmit(formData);
    } catch (error) {
      toastService.error(error.message || "Failed to save address.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Full Name"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        required
      />

      <Input
        label="Phone Number"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        required
      />

      <Input
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        required
      />

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />

        <Input
          label="State"
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          label="Postal Code"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          required
        />

        <Input
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Saving..." : "Save Address"}
      </Button>
    </form>
  );
};

export default ShippingForm;


