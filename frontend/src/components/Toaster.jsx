import React, { createContext, useContext, useState } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info", duration = 5000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const toast = {
    success: (message, duration) => addToast(message, "success", duration),
    error: (message, duration) => addToast(message, "error", duration),
    info: (message, duration) => addToast(message, "info", duration),
    warning: (message, duration) => addToast(message, "warning", duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

const Toast = ({ toast, onRemove }) => {
  const { message, type } = toast;

  const typeConfig = {
    success: {
      icon: CheckCircle,
      className: "bg-green-50 border-green-200 text-green-800",
      iconColor: "text-green-500",
    },
    error: {
      icon: AlertCircle,
      className: "bg-red-50 border-red-200 text-red-800",
      iconColor: "text-red-500",
    },
    warning: {
      icon: AlertCircle,
      className: "bg-yellow-50 border-yellow-200 text-yellow-800",
      iconColor: "text-yellow-500",
    },
    info: {
      icon: Info,
      className: "bg-blue-50 border-blue-200 text-blue-800",
      iconColor: "text-blue-500",
    },
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div
      className={`flex items-center p-4 border rounded-lg shadow-lg min-w-[300px] max-w-md animate-slide-up ${config.className}`}
    >
      <Icon className={`h-5 w-5 ${config.iconColor} mr-3 flex-shrink-0`} />
      <div className="flex-1 text-sm font-medium">{message}</div>
      <button
        onClick={onRemove}
        className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// Simple wrapper component for backwards compatibility
export const Toaster = () => {
  return null; // ToastContainer is rendered by ToastProvider
};

// Hook for components outside the provider
export const useToastSimple = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  return { toasts, addToast };
};
