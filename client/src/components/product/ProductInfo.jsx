import Button from "../common/Button";
import RatingStars from "../review/RatingStars";
import formatCurrency from "../../utils/formatCurrency";

const ProductInfo = ({
  product,
  onAddToCart,
  addingToCart,
  isOwnProduct,
}) => {
  if (!product) {
    return null;
  }

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Category */}
      {product.category?.name && (
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
          {product.category.name}
        </p>
      )}

      {/* Product Title */}
      <h1 className="text-4xl font-bold leading-tight text-stone-900">
        {product.title}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-3">
        <RatingStars rating={product.averageRating || 0} />

        <span className="text-sm text-stone-500">
          ({product.totalReviews || 0} Reviews)
        </span>
      </div>

      {/* Price */}
      <h2 className="text-4xl font-bold text-amber-800">
        {formatCurrency(product.price)}
      </h2>

      {/* Description */}
      <p className="leading-6 text-stone-600">
        {product.description}
      </p>

      {/* Product Information */}
      <div className="space-y-3 text-stone-600">
        <p>
          Stock:
          <strong className="ml-2 text-stone-900">
            {product.stock}
          </strong>
        </p>
      </div>

      {/* Sold By */}
      {product.store && (
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
            Sold By
          </p>

          <div className="mt-4 flex items-center gap-4">
            {/* Store Logo */}
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-white">
              {product.store.logo ? (
                <img
                  src={product.store.logo}
                  alt={`${product.store.storeName} logo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-center text-xs font-semibold text-stone-400">
                  No Logo
                </div>
              )}
            </div>

            {/* Store Name */}
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-stone-900">
                {product.store.storeName || "Unknown Store"}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Add To Cart */}
      <div className="pt-3">
        <Button
          type="button"
          onClick={onAddToCart}
          disabled={
            addingToCart ||
            product.stock <= 0 ||
            isOwnProduct
          }
          fullWidth
        >
          {addingToCart
            ? "Adding..."
            : isOwnProduct
              ? "Your Product"
              : product.stock <= 0
                ? "Out of Stock"
                : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;

