import { useEffect, useState } from "react";
import CategoryForm from "../../components/forms/CategoryForm";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import categoryService from "../../services/categoryService";
import getErrorMessage from "../../utils/errorHandler";
import toastService from "../../utils/toast";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  const loadCategories = async () => {
    const response = await categoryService.getCategories();
    setCategories(response.data || []);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        await loadCategories();
      } catch (error) {
        toastService.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (data) => {
    try {
      setSaving(true);

      if (editingCategory) {
        await categoryService.updateCategory(editingCategory._id, data);
        toastService.success("Category updated successfully.");
        setEditingCategory(null);
      } else {
        await categoryService.createCategory(data);
        toastService.success("Category created successfully.");
      }

      await loadCategories();
    } catch (error) {
      toastService.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (categoryId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(categoryId);

      await categoryService.deleteCategory(categoryId);

      setCategories((currentCategories) =>
        currentCategories.filter((category) => category._id !== categoryId),
      );

      if (editingCategory?._id === categoryId) {
        setEditingCategory(null);
      }

      toastService.success("Category deleted successfully.");
    } catch (error) {
      toastService.error(getErrorMessage(error));
    } finally {
      setDeletingId(null);
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
            Manage Categories
          </h1>
          <p className="mt-2 text-stone-600">
            Create, edit and manage product categories.
          </p>
        </div>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-stone-900">
              {editingCategory ? "Edit Category" : "Create Category"}
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              {editingCategory
                ? "Update the selected category."
                : "Add a new category for marketplace products."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <CategoryForm
              key={editingCategory?._id || "create"}
              initialValues={editingCategory || {}}
              loading={saving}
              submitLabel={
                editingCategory ? "Update Category" : "Create Category"
              }
              onSubmit={handleSubmit}
              onCancel={
                editingCategory ? () => setEditingCategory(null) : undefined
              }
            />
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Categories</h2>
              <p className="mt-1 text-sm text-stone-500">
                {categories.length}{" "}
                {categories.length === 1 ? "category" : "categories"} available.
              </p>
            </div>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-700">
              {categories.length}
            </span>
          </div>

          {!categories.length ? (
            <EmptyState
              title="No Categories"
              description="Create your first product category."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <article
                  key={category._id}
                  className="rounded-xl border border-stone-200 bg-stone-50 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3
                        title={category.name}
                        className="truncate font-semibold text-stone-900"
                      >
                        {category.name}
                      </h3>
                      <p className="mt-1 text-xs text-stone-500">
                        Product Category
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingCategory(category)}
                      className="flex-1 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={deletingId === category._id}
                      onClick={() => handleDelete(category._id)}
                      className="flex-1 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === category._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );

};

export default ManageCategories;



