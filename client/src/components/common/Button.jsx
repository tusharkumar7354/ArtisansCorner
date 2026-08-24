const Button = ({
  children,
  type = "button",
  variant = "primary",
  fullWidth = false,
  loading = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const variants = {
    primary: "bg-amber-700 text-white hover:bg-amber-800",

    secondary:
      "border border-stone-300 bg-white text-stone-800 hover:bg-stone-100",

    danger: "bg-red-600 text-white hover:bg-red-700",

    success: "bg-green-600 text-white hover:bg-green-700",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`rounded-xl px-5 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
        variants[variant]
      } ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default Button;


