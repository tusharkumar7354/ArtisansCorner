const EmptyState = ({
  title = "Nothing Found",
  description = "No data available.",
}) => {
  return (
    <div className="rounded-3xl border border-dashed border-stone-300 bg-white py-16 text-center">
      <h2 className="text-2xl font-bold text-stone-800">{title}</h2>

      <p className="mt-3 text-stone-500">{description}</p>
    </div>
  );
};

export default EmptyState;
