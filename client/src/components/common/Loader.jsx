const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex min-h-[250px] flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-300 border-t-amber-700" />

      <p className="text-stone-600">
        {text}
      </p>
    </div>
  );
};

export default Loader;