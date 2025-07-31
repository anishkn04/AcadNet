import React from 'react';
import { Dialog, DialogContent } from './dialog';
import { AlertTriangle } from 'lucide-react';
import { Button } from './button';

interface ConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title = "Confirm Action",
  message,
  confirmText = "Yes",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  variant = 'warning'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconColor: 'text-red-500',
          bgGradient: 'from-red-50 to-red-100',
          confirmButtonStyle: 'bg-red-500 hover:bg-red-600',
          iconBg: 'bg-red-200'
        };
      case 'warning':
        return {
          iconColor: 'text-orange-500',
          bgGradient: 'from-orange-50 to-yellow-50',
          confirmButtonStyle: 'bg-orange-500 hover:bg-orange-600',
          iconBg: 'bg-orange-100'
        };
      case 'info':
        return {
          iconColor: 'text-blue-500',
          bgGradient: 'from-blue-50 to-indigo-50',
          confirmButtonStyle: 'bg-blue-500 hover:bg-blue-600',
          iconBg: 'bg-blue-100'
        };
      default:
        return {
          iconColor: 'text-orange-500',
          bgGradient: 'from-orange-50 to-yellow-50',
          confirmButtonStyle: 'bg-orange-500 hover:bg-orange-600',
          iconBg: 'bg-orange-100'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className={`sm:max-w-md border-0 shadow-2xl bg-gradient-to-br ${styles.bgGradient} overflow-hidden`}>
        <div className={`flex flex-col items-center justify-center p-6 text-center`}>
          {/* Warning Icon */}
          <div className="mb-4 relative">
            <div className={`relative ${styles.iconBg} rounded-full p-3 shadow-lg`}>
              <AlertTriangle className={`h-8 w-8 ${styles.iconColor}`} />
            </div>
          </div>
          
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {title}
          </h2>
          
          {/* Message */}
          <p className="text-gray-700 mb-6 text-base font-medium leading-relaxed">
            {message}
          </p>
          
          {/* Action buttons */}
          <div className="flex gap-3 w-full">
            <Button 
              onClick={onCancel}
              variant="outline"
              className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm"
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button 
              onClick={onConfirm}
              className={`flex-1 ${styles.confirmButtonStyle} text-white shadow-lg font-semibold`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Removing...
                </div>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
