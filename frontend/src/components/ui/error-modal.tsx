import React, { useEffect } from 'react';
import { Dialog, DialogContent } from './dialog';
import { AlertCircle } from 'lucide-react';
import { Button } from './button';

interface ErrorModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  autoCloseDelay?: number; // in milliseconds, 0 means no auto close
  showCloseButton?: boolean;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  title = "Error",
  message,
  onClose,
  autoCloseDelay = 0, // No auto close by default for errors
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 shadow-2xl overflow-hidden">
        <div className="flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-red-50 to-rose-50 rounded-lg">
          {/* Error Icon with animation */}
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-red-200 rounded-full animate-ping opacity-60"></div>
            <div className="relative bg-white rounded-full p-4 shadow-lg transform animate-pulse">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
          </div>
          
          {/* Title with slide-up animation */}
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {title}
          </h2>
          
          {/* Message with fade-in */}
          <p className="text-gray-700 mb-8 text-lg font-medium opacity-90">
            {message}
          </p>
          
          {/* Close button if enabled */}
          {showCloseButton && (
            <Button 
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white shadow-lg px-6 py-2 text-base font-semibold"
            >
              Try Again
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorModal;
