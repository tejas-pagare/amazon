"use client";

import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.15)] transform transition-all duration-300 translate-y-0 opacity-100 min-w-[280px] max-w-[400px] text-sm font-bold ${
              t.type === "error"
                ? "bg-error text-on-error border border-error/50"
                : "bg-surface-container-highest text-on-surface border border-outline-variant/30"
            }`}
          >
            <span className="material-symbols-outlined text-xl">
              {t.type === "error" ? "error" : "check_circle"}
            </span>
            <p className="flex-1 leading-tight">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
