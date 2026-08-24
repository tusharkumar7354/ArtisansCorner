import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../../components/forms/ProductForm";
import categoryService from "../../services/categoryService";
import productService from "../../services/productService";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import getErrorMessage from "../../utils/errorHandler";
import toastService from "../../utils/toast";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [productResponse, categoryResponse] = await Promise.all([
          productService.getProductById(id),
          categoryService.getCategories(),
        ]);

        const productData =
          productResponse.data?.product || productResponse.data;

        const categoryData =
          categoryResponse.data?.categories || categoryResponse.data || [];

        if (!productData) {
          throw new Error("Product data could not be loaded.");
        }

        setProduct(productData);
        setCategories(categoryData);
      } catch (error) {
        const message = getErrorMessage(error);

        setError(message);
        toastService.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error || !product) {
    return <ErrorMessage message={error || "Product not found."} />;
  }

  return (
    <main className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
          Product Management
        </p>

        <h1 className="mt-2 text-4xl font-black">Edit Product</h1>

        <p className="mt-2 text-stone-600">
          Update your product information, inventory and images.
        </p>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <ProductForm
          initialValues={product}
          categories={categories}
          onSubmit={async (formData) => {
            try {
              await productService.updateProduct(id, formData);

              toastService.success("Product updated successfully.");

              navigate("/seller/products");
            } catch (error) {
              throw error();
            }
          }}
        />
      </div>
    </main>
  );
};

export default EditProduct;







