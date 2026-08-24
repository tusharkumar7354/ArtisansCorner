import { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import toastService from "../../utils/toast";

const ProductForm = ({
  categories = [],
  initialValues = {},
  loading = false,
  onSubmit,
  requireImages = false,
}) => {
  const [formData, setFormData] = useState({
    title: initialValues?.title || "",
    description: initialValues?.description || "",
    category: initialValues?.category?._id || initialValues?.category || "",
    price: initialValues?.price ?? "",
    stock: initialValues?.stock ?? "",
  });

  const [images, setImages] = useState([]);

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleImageChange = (event) => {
    setImages([...event.target.files]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (requireImages && images.length === 0) {
        toastService.error("Please select at least one product image.");
        return;
      }

      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) =>
        payload.append(key, value),
      );

      images.forEach((image) => payload.append("images", image));

      await onSubmit(payload);
    } catch (error) {
      toastService.error(error.message || "Failed to save product.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Product Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <div>
        <label className="mb-2 block font-medium">Description</label>

        <textarea
          rows={5}
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded-xl border border-stone-300 p-4"
          required
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">Category</label>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full rounded-xl border border-stone-300 px-4 py-3"
          required
        >
          <option value="">Select Category</option>

          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          label="Price"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <Input
          label="Stock"
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        {initialValues?.images?.length > 0 && (
          <>
            <label className="mb-2 block font-medium">
              Current Product Images
            </label>

            <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {initialValues.images.map((image, index) => (
                <div
                  key={image.public_id || image.url || index}
                  className="aspect-square overflow-hidden rounded-xl border border-stone-200 bg-stone-100"
                >
                  <img
                    src={image.url}
                    alt={`Current product image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </>
        )}

        <label className="mb-2 block font-medium">
          {initialValues?.images?.length > 0
            ? "Replace Product Images"
            : "Product Images"}
        </label>

        <p className="mb-3 text-sm text-stone-500">
          Leave this empty to keep the current images. Select new images only if
          you want to replace the current images.
        </p>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full rounded-xl border border-stone-300 p-3"
        />
      </div>

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Saving..." : "Save Product"}
      </Button>
    </form>
  );
};

export default ProductForm;



