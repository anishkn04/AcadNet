import { useAuth } from '@/hooks/userContext';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type Props = { children: React.ReactNode };

const ProtectedRoutes = ({ children }: Props) => {
  const location = useLocation();
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isLoggedIn() ? (
    <>{children}</>
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
};

export default ProtectedRoutes;