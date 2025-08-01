import { useAuth } from '@/hooks/userContext';
import { useData } from '@/hooks/userInfoContext';
import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from '@/utils/toast';

type Props = { children: React.ReactNode };

const SysAdminProtectedRoute = ({ children }: Props) => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const { userProfile } = useData();
  const hasShownToast = useRef(false);

  useEffect(() => {
    // Show unauthorized message only once if user is authenticated but not admin
    if (isAuthenticated && !isLoading && userProfile && userProfile.role !== 'admin' && !hasShownToast.current) {
      toast.error('You are unauthorized to access this page.');
      hasShownToast.current = true;
    }
  }, [isAuthenticated, isLoading, userProfile]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (userProfile && userProfile.role !== 'admin') {
    return <Navigate to='/user' replace />;
  }

  return <>{children}</>;
};

export default SysAdminProtectedRoute;
