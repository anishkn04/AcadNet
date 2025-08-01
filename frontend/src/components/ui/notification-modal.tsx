import React, { useEffect } from 'react';
import { Dialog, DialogContent } from './dialog';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastModalProps {
  isOpen: boolean;
  type: ToastType;
  title?: string;
  message: string;
  onClose: () => void;
  autoCloseDelay?: number;
  showCloseButton?: boolean;
}

const ToastModal: React.FC<ToastModalProps> = ({
  isOpen,
  type,
  title,
  message,
  onClose,
  autoCloseDelay = 5000, // 5 seconds default
  showCloseButton = true
}) => {
  useEffect(() => {
    if (isOpen && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseDelay, onClose]);

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-500',
          bgGradient: 'from-green-50 to-emerald-50',
          iconBg: 'bg-green-100',
          borderColor: 'border-green-200',
          titleColor: 'text-green-800',
          messageColor: 'text-green-700',
          defaultTitle: 'Success!'
        };
      case 'error':
        return {
          icon: AlertCircle,
          iconColor: 'text-red-500',
          bgGradient: 'from-red-50 to-rose-50',
          iconBg: 'bg-red-100',
          borderColor: 'border-red-200',
          titleColor: 'text-red-800',
          messageColor: 'text-red-700',
          defaultTitle: 'Error'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-500',
          bgGradient: 'from-yellow-50 to-orange-50',
          iconBg: 'bg-yellow-100',
          borderColor: 'border-yellow-200',
          titleColor: 'text-yellow-800',
          messageColor: 'text-yellow-700',
          defaultTitle: 'Warning'
        };
      case 'info':
        return {
          icon: Info,
          iconColor: 'text-blue-500',
          bgGradient: 'from-blue-50 to-indigo-50',
          iconBg: 'bg-blue-100',
          borderColor: 'border-blue-200',
          titleColor: 'text-blue-800',
          messageColor: 'text-blue-700',
          defaultTitle: 'Information'
        };
      default:
        return {
          icon: Info,
          iconColor: 'text-gray-500',
          bgGradient: 'from-gray-50 to-slate-50',
          iconBg: 'bg-gray-100',
          borderColor: 'border-gray-200',
          titleColor: 'text-gray-800',
          messageColor: 'text-gray-700',
          defaultTitle: 'Notification'
        };
    }
  };

  const config = getToastConfig();
  const IconComponent = config.icon;
  const displayTitle = title || config.defaultTitle;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`
          fixed top-4 left-1/2 transform -translate-x-1/2 translate-y-0
          sm:max-w-md w-full mx-4 border-0 shadow-2xl 
          bg-gradient-to-br ${config.bgGradient} overflow-hidden rounded-lg
          animate-in slide-in-from-top-full duration-500 ease-out
          data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-full
        `}
      >
        <div className="flex items-start gap-4 p-6">
          {/* Icon with enhanced styling */}
          <div className={`flex-shrink-0 ${config.iconBg} rounded-full p-3 shadow-lg relative`}>
            {/* Add subtle animation based on type */}
            {type === 'success' && (
              <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-40"></div>
            )}
            {type === 'error' && (
              <div className="absolute inset-0 bg-red-200 rounded-full animate-pulse opacity-40"></div>
            )}
            <IconComponent className={`h-6 w-6 ${config.iconColor} relative z-10`} />
          </div>
          
          {/* Content with enhanced styling */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-bold ${config.titleColor} mb-2`}>
              {displayTitle}
            </h3>
            <p className={`text-sm ${config.messageColor} leading-relaxed font-medium`}>
              {message}
            </p>
          </div>
          
          {/* Enhanced close button */}
          {showCloseButton && (
            <button
              onClick={onClose}
              className={`
                flex-shrink-0 ${config.iconColor} hover:bg-white hover:bg-opacity-70 
                rounded-full p-2 transition-all duration-200 hover:scale-110
                focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50
              `}
              title="Close notification"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Enhanced progress bar for auto-close */}
        {autoCloseDelay > 0 && (
          <div className="h-1.5 bg-black bg-opacity-10 overflow-hidden">
            <div 
              className={`h-full ${config.iconColor.replace('text-', 'bg-')} transition-all ease-linear shadow-sm`}
              style={{
                width: '100%',
                animation: `shrinkWidth ${autoCloseDelay}ms linear forwards`,
                transformOrigin: 'left'
              }}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ToastModal;