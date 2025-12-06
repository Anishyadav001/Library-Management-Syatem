function Modal({ title, children, onClose }) {
  try {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-[var(--card-bg)] rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-[var(--secondary-color)] rounded-lg">
              <div className="icon-x text-xl"></div>
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Modal component error:', error);
    return null;
  }
}