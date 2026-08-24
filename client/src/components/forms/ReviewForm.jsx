import { useState } from "react";
import Button from "../common/Button";
import toastService from "../../utils/toast";

const ReviewForm = ({ submitting = false, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const success = await onSubmit({
        rating,
        comment,
      });

      if (success) {
        setRating(5);
        setComment("");
      }
    } catch (error) {
      toastService.error(error.message || "Failed to submit review.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block font-medium">Rating</label>

        <select
          value={rating}
          onChange={(event) => setRating(Number(event.target.value))}
          className="w-full rounded-xl border border-stone-300 px-4 py-3"
        >
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>
              {value} Star
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block font-medium">Review</label>

        <textarea
          rows={5}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          className="w-full rounded-xl border border-stone-300 p-4"
          placeholder="Write your review..."
          required
        />
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
};

export default ReviewForm;



