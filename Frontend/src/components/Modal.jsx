export default function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative bg-white w-full ${maxWidth} rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F2F4F6] sticky top-0 bg-white z-10">
          <h2 className="text-[#191C1E] font-bold text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="text-[#64748B] hover:text-[#191C1E] text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
