import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductGallery from "../../components/product/ProductGallery";
import ProductInfo from "../../components/product/ProductInfo";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import ReviewForm from "../../components/forms/ReviewForm";
import ReviewList from "../../components/review/ReviewList";
import productService from "../../services/productService";
import reviewService from "../../services/reviewService";
import useCart from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth";
import getErrorMessage from "../../utils/errorHandler";
import toastService from "../../utils/toast";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [error, setError] = useState("");
  const [reviewError, setReviewError] = useState("");

  const isOwnProduct =
    user?._id && product?.seller?._id && user._id === product.seller._id;

  const fetchProduct = useCallback(async () => {
    const response = await productService.getProductById(id);
    setProduct(response.data?.product || response.data);
  }, [id]);

  const fetchReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      setReviewError("");
      const response = await reviewService.getProductReviews(id);
      setReviews(response.data || []);
    } catch (error) {
      setReviewError(getErrorMessage(error));
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");
        await Promise.all([fetchProduct(), fetchReviews()]);
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchProduct, fetchReviews]);

  const handleAddToCart = async () => {
  if (!product) {
    return;
  }

  if (!isAuthenticated) {
    toastService.error("Please login to add products to your cart.");
    return;
  }

  if (product.stock <= 0) {
    toastService.error("This product is out of stock.");
    return;
  }

    if (isOwnProduct) {
      toastService.error("You cannot buy your own product.");
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(product._id, 1);
      toastService.success("Product added to cart.");
    } catch (error) {
      toastService.error(getErrorMessage(error));
    } finally {
      setAddingToCart(false);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      setSubmittingReview(true);
      setReviewError("");

      await reviewService.createReview({
        productId: product._id,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });

      toastService.success("Review submitted successfully.");

      await Promise.all([fetchProduct(), fetchReviews()]);

      return true;
    } catch (error) {
      toastService.error(getErrorMessage(error));
      return false;
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <Loader text="Loading Product..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!product) {
    return <ErrorMessage message="Product not found." />;
  }

  return (
    <main className="space-y-10">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="flex justify-center">
            <div className="w-full max-w-[515px]">
              <ProductGallery images={product.images} />
            </div>
          </div>

          <ProductInfo
            product={product}
            addingToCart={addingToCart}
            isOwnProduct={isOwnProduct}
            onAddToCart={handleAddToCart}
          />
        </div>
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-stone-900">
            Customer Reviews
          </h2>

          <span className="rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-600">
            {reviews.length} Reviews
          </span>
        </div>

        {reviewsLoading ? (
          <Loader text="Loading Reviews..." />
        ) : (
          <ReviewList reviews={reviews} />
        )}

        {reviewError && (
          <div className="mt-6">
            <ErrorMessage message={reviewError} />
          </div>
        )}
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-bold text-stone-900">Write a Review</h2>

        <p className="mt-2 text-stone-600">
          Share your experience with other buyers.
        </p>

        <div className="mt-8">
          {!isAuthenticated ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="font-medium text-amber-800">
                Please login to write a review.
              </p>
            </div>
          ) : isOwnProduct ? (
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
              <p className="text-stone-700">
                You cannot review your own product.
              </p>
            </div>
          ) : (
            <ReviewForm
              submitting={submittingReview}
              onSubmit={handleReviewSubmit}
            />
          )}
        </div>
      </section>
    </main>
  );
};

export default ProductDetails;



