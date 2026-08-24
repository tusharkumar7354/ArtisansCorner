const Input = ({ label, error, className = "", ...props }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-semibold text-stone-700">{label}</label>
      )}

      <input
        className={`w-full rounded-xl border border-stone-300 bg-white px-4 py-3 transition focus:border-amber-700 ${className}`}
        {...props}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;





