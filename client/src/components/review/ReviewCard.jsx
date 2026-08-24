import RatingStars from "./RatingStars";
import formatDate from "../../utils/formatDate";

const ReviewCard = ({ review }) => {
  return (
    <article className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <strong>{review.user?.name || "Buyer"}</strong>
        <RatingStars rating={review.rating} />
      </div>

      {review.comment && (
        <p className="mt-3 leading-7 text-stone-600">{review.comment}</p>
      )}

      {review.createdAt && (
        <small className="mt-4 block text-sm text-stone-400">
          {formatDate(review.createdAt)}
        </small>
      )}
    </article>
  );
};

export default ReviewCard;




