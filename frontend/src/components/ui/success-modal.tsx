import React, { useEffect } from 'react';
import { Dialog, DialogContent } from './dialog';
import { CheckCircle } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  autoCloseDelay?: number; // in milliseconds
  onAutoClose?: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  title = "Success!",
  message,
  onClose,
  autoCloseDelay = 2000, // 3 seconds default
  onAutoClose
}) => {
  useEffect(() => {
    if (isOpen && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose();
        if (onAutoClose) {
          onAutoClose();
        }
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseDelay, onClose, onAutoClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 shadow-2xl overflow-hidden">
        <div className="flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-blue-50 to-emerald-50 rounded-lg">
          {/* Success Icon with animation */}
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-blue-200 rounded-full animate-ping opacity-60"></div>
            <div className="relative bg-white rounded-full p-4 shadow-lg transform animate-bounce">
              <CheckCircle className="h-12 w-12 text-blue-500" />
            </div>
          </div>
          
          {/* Title with slide-up animation */}
          <h2 className="text-3xl font-bold text-gray-900 mb-3 transform animate-pulse">
            {title}
          </h2>
          
          {/* Message with fade-in */}
          <p className="text-gray-700 mb-8 text-lg font-medium opacity-90">
            {message}
          </p>
          
          {/* Loading indicator */}
          <div className="flex items-center gap-3 text-sm text-gray-600 bg-white px-6 py-3 rounded-full shadow-lg border border-gray-100">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
            <span className="font-semibold">Redirecting to your group...</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
