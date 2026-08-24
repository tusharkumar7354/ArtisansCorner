const RatingStars = ({ rating = 0, interactive = false, onChange }) => {
  const handleRating = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  return (
    <div
      className="flex items-center gap-1"
      role={interactive ? "radiogroup" : undefined}
      aria-label="Rating"
    >
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => handleRating(value)}
          disabled={!interactive}
          aria-label={`${value} star`}
          aria-pressed={interactive ? value === rating : undefined}
          className={`text-2xl transition ${
            interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
          } ${value <= rating ? "text-yellow-500" : "text-stone-300"}`}
        >
          {value <= rating ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
};

export default RatingStars;
