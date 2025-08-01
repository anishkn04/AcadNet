import React, { useEffect } from 'react';
import { useToast } from '@/hooks/useToast';

const GlobalToastInstance: React.FC = () => {
  const toastMethods = useToast();

  useEffect(() => {
    // Attach toast methods to window object for global access
    (window as any).__globalToast = toastMethods;

    return () => {
      // Cleanup when component unmounts
      delete (window as any).__globalToast;
    };
  }, [toastMethods]);

  return null; // This component doesn't render anything
};

export default GlobalToastInstance;
