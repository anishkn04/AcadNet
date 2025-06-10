import { useAuth } from '@/hooks/userContext';
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify';

type Props = {children:React.ReactNode}

const ProtectedRoutes = ({children}: Props) => {
    const location = useLocation();
    const {isLoggedIn} = useAuth();
  return isLoggedIn() ? (
    <>{children}</>
  ):(
    <>
        <Navigate to='/login' state = {{from:location}} replace/>
        {/* {toast.warning("Please Login!")} */}
    </>
  )
}

export default ProtectedRoutes