const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-10 flex items-center justify-center gap-3">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-lg border px-4 py-2 disabled:opacity-40"
      >
        Previous
      </button>

      <span className="font-semibold">
        {page} / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-lg border px-4 py-2 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
