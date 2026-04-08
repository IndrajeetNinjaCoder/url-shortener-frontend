import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

let id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 3000) => {
    const toast = { id: ++id, message, type };
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, duration);
  }, []);

  const removeToast = useCallback((toastId) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-medium backdrop-blur-sm border animate-slide-up max-w-sm ${
              toast.type === "success"
                ? "bg-emerald-950/90 border-emerald-700/50 text-emerald-100"
                : toast.type === "error"
                ? "bg-red-950/90 border-red-700/50 text-red-100"
                : "bg-zinc-900/90 border-zinc-700/50 text-zinc-100"
            }`}
          >
            <span className="text-base">
              {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}
            </span>
            {toast.message}
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-auto opacity-50 hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);