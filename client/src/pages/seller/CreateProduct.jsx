import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../../components/forms/ProductForm";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import getErrorMessage from "../../utils/errorHandler";
import toastService from "../../utils/toast";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        setError("");

        const response = await categoryService.getCategories();

        setCategories(response.data || []);
      } catch (error) {
        const message = getErrorMessage(error);

        setError(message);
        toastService.error(message);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError("");

      await productService.createProduct(formData);

      toastService.success("Product created successfully.");

      navigate("/seller/products");
    } catch (error) {
      const message = getErrorMessage(error);

      setError(message);
      toastService.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingCategories) {
    return <Loader />;
  }

  return (
    <main className="space-y-8">
      <div>
        <h1 className="text-4xl font-black">Create Product</h1>

        <p className="mt-2 text-stone-600">
          Add a new handmade product to your store.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      <ProductForm
        categories={categories}
        loading={loading}
        onSubmit={handleSubmit}
        requireImages
      />
    </main>
  );
};

export default CreateProduct;


