import React, { createContext, useContext, useState, useCallback } from 'react';
import ToastModal from '@/components/ui/notification-modal';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  title?: string;
  autoCloseDelay?: number;
  showCloseButton?: boolean;
}

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  autoCloseDelay?: number;
  showCloseButton?: boolean;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, options?: ToastOptions) => void;
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentToast, setCurrentToast] = useState<Toast | null>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const showToast = useCallback((type: ToastType, message: string, options: ToastOptions = {}) => {
    const newToast: Toast = {
      id: generateId(),
      type,
      message,
      title: options.title,
      autoCloseDelay: options.autoCloseDelay ?? 2000, // Changed to 5000ms (5 seconds)
      showCloseButton: options.showCloseButton ?? true,
    };

    // If there's already a toast showing, close it first
    if (currentToast) {
      setCurrentToast(null);
      // Small delay to allow previous toast to close before showing new one
      setTimeout(() => {
        setCurrentToast(newToast);
      }, 100);
    } else {
      setCurrentToast(newToast);
    }
  }, [currentToast]);

  const closeToast = useCallback(() => {
    setCurrentToast(null);
  }, []);

  const success = useCallback((message: string, options?: ToastOptions) => {
    showToast('success', message, options);
  }, [showToast]);

  const error = useCallback((message: string, options?: ToastOptions) => {
    showToast('error', message, options);
  }, [showToast]);

  const info = useCallback((message: string, options?: ToastOptions) => {
    showToast('info', message, options);
  }, [showToast]);

  const warning = useCallback((message: string, options?: ToastOptions) => {
    showToast('warning', message, options);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      {currentToast && (
        <ToastModal
          isOpen={true}
          type={currentToast.type}
          title={currentToast.title}
          message={currentToast.message}
          onClose={closeToast}
          autoCloseDelay={currentToast.autoCloseDelay}
          showCloseButton={currentToast.showCloseButton}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Create a toast object that mimics the react-toastify API for easy replacement
export const toast = {
  success: (message: string, options?: ToastOptions) => {
    // This will be handled by the global toast instance
    if (typeof window !== 'undefined' && (window as any).__globalToast) {
      (window as any).__globalToast.success(message, options);
    }
  },
  error: (message: string, options?: ToastOptions) => {
    if (typeof window !== 'undefined' && (window as any).__globalToast) {
      (window as any).__globalToast.error(message, options);
    }
  },
  info: (message: string, options?: ToastOptions) => {
    if (typeof window !== 'undefined' && (window as any).__globalToast) {
      (window as any).__globalToast.info(message, options);
    }
  },
  warning: (message: string, options?: ToastOptions) => {
    if (typeof window !== 'undefined' && (window as any).__globalToast) {
      (window as any).__globalToast.warning(message, options);
    }
  },
  warn: (message: string, options?: ToastOptions) => {
    if (typeof window !== 'undefined' && (window as any).__globalToast) {
      (window as any).__globalToast.warning(message, options);
    }
  }
};
