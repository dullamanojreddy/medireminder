import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertOctagon, AlertTriangle, Info, X } from "lucide-react";
import { ToastMessage } from "../types";

interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (message: string, type: ToastMessage["type"]) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastMessage["type"]) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Automatically dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

interface ToastItemProps {
  key?: string;
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-success" />,
    danger: <AlertOctagon className="w-5 h-5 text-danger" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning" />,
    info: <Info className="w-5 h-5 text-primary" />,
  };

  const bgClasses = {
    success: "bg-white border-l-4 border-success",
    danger: "bg-white border-l-4 border-danger",
    warning: "bg-white border-l-4 border-warning",
    info: "bg-white border-l-4 border-primary",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`pointer-events-auto flex items-start gap-3.5 p-4 rounded-input shadow-soft border border-brand-border ${bgClasses[toast.type]}`}
    >
      <div className="flex-shrink-0 mt-0.5">{iconMap[toast.type]}</div>
      <div className="flex-1 text-sm font-medium text-text-primary leading-tight">
        {toast.message}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
