import EmptyState from "../common/EmptyState";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products }) => {
  if (!products?.length) {
    return (
      <EmptyState
        title="No Products Found"
        description="There are no products available right now."
      />
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;

