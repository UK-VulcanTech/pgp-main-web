import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";

const ToastCtx = createContext({ toast: () => {} });

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const toast = useCallback((message, kind = "success") => {
    const id = Math.random().toString(36).slice(2);
    setItems((prev) => [...prev, { id, message, kind }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);
  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {items.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-2 rounded-lg border px-4 py-3 shadow-lg ${
              t.kind === "error"
                ? "bg-red-50 border-red-200 text-red-900"
                : "bg-emerald-50 border-emerald-200 text-emerald-900"
            }`}
          >
            {t.kind === "error" ? (
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            ) : (
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            )}
            <div className="text-sm flex-1">{t.message}</div>
            <button
              onClick={() => setItems((prev) => prev.filter((x) => x.id !== t.id))}
              className="opacity-50 hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
