const Modal = ({ open, title, children, onClose }) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-2xl font-bold">{title}</h2>

        <div className="mt-5">{children}</div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-stone-900 px-5 py-2 text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
