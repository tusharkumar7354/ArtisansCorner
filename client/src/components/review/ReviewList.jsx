import EmptyState from "../common/EmptyState";
import ReviewCard from "./ReviewCard";

const ReviewList = ({ reviews }) => {
  if (!reviews?.length) {
    return (
      <EmptyState
        title="No Reviews Yet"
        description="Be the first customer to review this product."
      />
    );
  }

  return (
    <div className="space-y-5">
      {reviews.map((review) => (
        <ReviewCard key={review._id} review={review} />
      ))}
    </div>
  );
};

export default ReviewList;
