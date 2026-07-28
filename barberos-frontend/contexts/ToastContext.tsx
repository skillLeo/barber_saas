"use client";
import { createContext, useContext, useState, useCallback, useRef } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  success: (msg: string) => void;
  error: (msg: string) => void;
  info: (msg: string) => void;
  warning: (msg: string) => void;
}

const ToastContext = createContext<ToastContextValue>({
  success: () => {},
  error: () => {},
  info: () => {},
  warning: () => {},
});

const toastStyles: Record<ToastType, { bg: string; color: string; border: string }> = {
  success: { bg: "var(--success-bg)", color: "var(--success)", border: "rgba(22,163,74,0.25)" },
  error: { bg: "var(--error-bg)", color: "var(--error)", border: "rgba(225,29,72,0.25)" },
  info: { bg: "var(--info-bg)", color: "var(--info)", border: "rgba(79,70,229,0.25)" },
  warning: { bg: "var(--warning-bg)", color: "var(--warning)", border: "rgba(217,119,6,0.25)" },
};

function ToastIcon({ type }: { type: ToastType }) {
  if (type === "success") return <CheckCircle2 size={16} />;
  if (type === "error") return <XCircle size={16} />;
  if (type === "warning") return <Info size={16} style={{ transform: "rotate(180deg)" }} />;
  return <Info size={16} />;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = ++counterRef.current;
    setToasts(prev => [...prev.slice(-4), { id, type, message }]);
    setTimeout(() => dismiss(id), 3500);
  }, [dismiss]);

  const ctx: ToastContextValue = {
    success: (msg) => addToast("success", msg),
    error: (msg) => addToast("error", msg),
    info: (msg) => addToast("info", msg),
    warning: (msg) => addToast("warning", msg),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      {/* Toast container */}
      <div style={{
        position: "fixed", bottom: 20, right: 20, zIndex: 9999,
        display: "flex", flexDirection: "column", gap: 8,
        pointerEvents: "none",
      }}>
        {toasts.map(t => {
          const s = toastStyles[t.type];
          return (
            <div
              key={t.id}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px 14px",
                borderRadius: 12,
                background: "var(--bg-card)",
                border: `1px solid ${s.border}`,
                boxShadow: "var(--shadow-md)",
                minWidth: 260, maxWidth: 360,
                pointerEvents: "auto",
                animation: "fadeUp 0.25s ease both",
              }}
            >
              <span style={{ color: s.color, flexShrink: 0 }}>
                <ToastIcon type={t.type} />
              </span>
              <span style={{ fontSize: 13, color: "var(--text-primary)", flex: 1 }}>{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: 2, flexShrink: 0,
                  display: "flex", alignItems: "center",
                  color: "var(--text-muted)",
                }}
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
