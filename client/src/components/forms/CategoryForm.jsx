import { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import toastService from "../../utils/toast";

const CategoryForm = ({
  initialValues = {},
  onSubmit,
  loading = false,
  submitLabel = "Create Category",
  onCancel,
}) => {
  const [name, setName] = useState(initialValues.name || "");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const categoryName = name.trim();

    if (!categoryName) {
      toastService.error("Category name is required.");
      return;
    }

    if (categoryName.length < 3) {
      toastService.error("Category name must be at least 3 characters.");
      return;
    }

    try {
      await onSubmit({
        name: categoryName,
      });
    } catch (error) {
      toastService.error(error?.message || "Unable to save category.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Category Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Enter category name"
        required
      />

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </Button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default CategoryForm;



