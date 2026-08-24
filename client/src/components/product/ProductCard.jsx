import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import formatCurrency from "../../utils/formatCurrency";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const BACKEND_URL = API_URL.replace(/\/api\/?$/, "");

const getProductImage = (product) => {
  const image = product?.images?.[0];

  if (!image) {
    return null;
  }

  const imageUrl = typeof image === "string" ? image : image.url;

  if (!imageUrl) {
    return null;
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    return `${BACKEND_URL}${imageUrl}`;
  }

  return `${BACKEND_URL}/${imageUrl}`;
};

const ProductCard = ({ product }) => {
  const image = getProductImage(product);

  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <Link to={`/products/${product._id}`}>
        <div className="h-80 w-full overflow-hidden bg-stone-100">
          {image ? (
            <img
              src={image}
              alt={product?.title || "Product"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-stone-400">
              No Image
            </div>
          )}
        </div>

        <div className="space-y-3 p-5">
          <div>
            <p className="text-sm text-stone-500">
              {product.category?.name || "Handmade"}
            </p>

            <h3 className="mt-1 line-clamp-2 text-lg font-bold text-stone-900">
              {product.title}
            </h3>

            {product.store?.storeName && (
              <p className="mt-2 text-sm font-medium text-amber-700">
                by {product.store.storeName}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />

            <span className="text-sm text-stone-600">
              {product.averageRating || 0}
            </span>

            <span className="text-sm text-stone-400">
              ({product.totalReviews || 0})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-amber-800">
              {formatCurrency(product.price)}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                product.stock
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.stock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;


