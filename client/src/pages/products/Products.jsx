import { useEffect, useState } from "react";
import ProductGrid from "../../components/product/ProductGrid";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import SearchBar from "../../components/common/SearchBar";
import productService from "../../services/productService";
import getErrorMessage from "../../utils/errorHandler";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await productService.getProducts();
        const allProducts = response.data?.products || [];
        setProducts(allProducts);
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (!search.trim()) {
      return true;
    }

    const keyword = search.toLowerCase();

    return (
      product.title?.toLowerCase().includes(keyword) ||
      product.description?.toLowerCase().includes(keyword) ||
      product.category?.name?.toLowerCase().includes(keyword) ||
      product.store?.storeName?.toLowerCase().includes(keyword)
    );
  });

  if (loading) {
    return <Loader text="Loading Products..." />;
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-10 px-6 pt-8">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-semibold uppercase tracking-widest text-amber-700">
              Marketplace
            </p>

            <h1 className="mt-2 text-4xl font-black text-stone-900">
              Handmade Products
            </h1>

            <p className="mt-3 max-w-2xl text-stone-600">
              Discover unique handmade products crafted by talented artisans
              from across the marketplace.
            </p>
          </div>

          <div className="w-full lg:w-96">
            <SearchBar
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
            />
          </div>
        </div>
      </section>

      {error && <ErrorMessage message={error} />}

      {!error && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-stone-600">
              Showing{" "}
              <span className="font-semibold text-stone-900">
                {filteredProducts.length}
              </span>{" "}
              Products
            </p>
          </div>

          <ProductGrid products={filteredProducts} />
        </>
      )}
    </main>
  );
};

export default Products;

