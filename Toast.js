const ToastContext = React.createContext();

function Toast() {
  try {
    const [toasts, setToasts] = React.useState([]);

    React.useEffect(() => {
      window.showToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
      };
    }, []);

    return (
      <div className="fixed top-4 right-4 z-50 space-y-2" data-name="toast" data-file="components/Toast.js">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-6 py-3 rounded-lg shadow-lg text-white animate-slide-in ${
              toast.type === 'success' ? 'bg-[var(--success-color)]' :
              toast.type === 'error' ? 'bg-[var(--danger-color)]' :
              toast.type === 'warning' ? 'bg-[var(--warning-color)]' :
              'bg-[var(--primary-color)]'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error('Toast component error:', error);
    return null;
  }
}