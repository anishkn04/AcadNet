// useContext.tsx
import type { UserProfile } from "@/models/User";
import React, { createContext, useEffect, useState, useRef } from "react";
import {
  loginAPI,
  registerAPI,
  logoutAPI,
  checkSessionAPI,
  forgotPasswordAPI,
  verifyOTPAndResetPasswordAPI,
  sendSignupOtpAPI,
  verifySignupOtpAPI,
  refresTokenAPI,
} from "@/services/AuthServices";
import { toast } from "react-toastify";
import axios from 'axios';

type UserContextType = {
  user: UserProfile | null;
  registerUser: (email: string, username: string, password: string) => Promise<boolean>;
  loginUser: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoggedIn: () => boolean;
  isLoading: boolean;
  isVerified:boolean;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPasswordWithOTP: (otp: string, newPassword: string) => Promise<boolean>;
  sendSignupOtp: () => Promise<boolean>;
  verifySignupOtp: (otp: string) => Promise<boolean>;
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

const SESSION_CHECK_INTERVAL = 10 * 1000;
const TOKEN_REFRESH_INTERVAL = 10 * 60 * 1000;

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVerified,setIsVerified] = useState<boolean>(false);
  const sessionCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const tokenRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const startSessionMonitoring = () => {
    if (sessionCheckIntervalRef.current) {
      clearInterval(sessionCheckIntervalRef.current);
    }
    if (tokenRefreshIntervalRef.current) {
      clearInterval(tokenRefreshIntervalRef.current);
    }

    sessionCheckIntervalRef.current = setInterval(async () => {
      try {
        const { data, status } = await checkSessionAPI();
        if (status === 200 && data.success === true) {
          console.log('session is running')
        } else {
         setUser(null);
          stopSessionMonitoring();
          toast.info("Your session has expired. Please log in again.");
        }
      } catch (error) {
        setUser(null);
        console.log(error)
      }
    }, SESSION_CHECK_INTERVAL);

    tokenRefreshIntervalRef.current = setInterval(async () => {
      try {
        const { data, status } = await refresTokenAPI();
        if (status !== 200 && !data.success === true) {
          setUser(null);
          toast.info("Could not refresh session. Please log in again.");
        }
      } catch{
        setUser(null);
        toast.info("Could not refresh session. Please log in again.");
      }
    }, TOKEN_REFRESH_INTERVAL);
  };

  const stopSessionMonitoring = () => {
    if (sessionCheckIntervalRef.current) {
      clearInterval(sessionCheckIntervalRef.current);
      sessionCheckIntervalRef.current = null;
    }
    if (tokenRefreshIntervalRef.current) {
      clearInterval(tokenRefreshIntervalRef.current);
      tokenRefreshIntervalRef.current = null;
    }
  };

  useEffect(() => {
    const verifyUserSession = async () => {
      try {
        const { data, status } = await checkSessionAPI();
        if (status === 200 && data.success === true) {
          setUser({ userName: "Authenticated User", email: "user@example.com" });
          console.log("sessionstarted")
          startSessionMonitoring();
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    verifyUserSession();

    return () => {
      stopSessionMonitoring();
    };
  }, []);

  const registerUser = async (email: string, username: string, password: string): Promise<boolean> => {
    try {
      await registerAPI(email, username, password);
      return true;
    } catch (e) {
      if (axios.isAxiosError(e) && e.response && e.response.data && e.response.data.message) {
          toast.info(e.response.data.message);
      } else {
        console.log("Registration failed.");
      }
      return false;
    }
  };

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, status } = await loginAPI(email, password);
      if (status === 200 && data.success === true) {
        setUser({ userName: "Authenticated User", email: "user@example.com" });
        toast.success("Login Success!");
        startSessionMonitoring();
        return true;
      }else {
        toast.error("Login failed. Please check your credentials.");
        return false;
      }
    } catch (e) {
      if (axios.isAxiosError(e) && e.response && e.response.data && e.response.data.message) {
        if (e.response.status === 409 && e.response.data.message === "Please Login via GitHub") {
          toast.error("You registered with GitHub. Please log in using GitHub.");
          return false
        } else if (e.response.status === 401) {
          toast.error("Invalid email or password. Please try again.");
        } else if(e.response.data.message === "Redirecting to /otp-auth"){
         
          setIsVerified(true);
          
        }else{
          setIsVerified(false)
        }
      } else {
        toast.error("Login failed. Could not connect to the server or an unknown error occurred.");
      }
      return false;
    }
  };

  const isLoggedIn = () => {
    return !!user;
  };

  const logout = async () => {
    try {
      await logoutAPI();
    } catch{
      toast.error("Logout failed. Please try again.");
    } finally {
      setUser(null);
      stopSessionMonitoring();
      toast.info("You have been logged out.");
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      const { data, status } = await forgotPasswordAPI(email);
      if (status === 200 && data.success === true) {
        toast.success(data.message || "Password reset OTP has been sent to your email!");
        return true;
      } else {
        toast.error(data.message || "Failed to send OTP. Please check the email address.");
        return false;
      }
    } catch (e) {
      if (axios.isAxiosError(e) && e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message);
      } else {
        toast.error("Could not connect to the server or an unknown error occurred.");
      }
    }
    return false;
  };

  const resetPasswordWithOTP = async (otp: string, newPassword: string): Promise<boolean> => {
    try {
      const { data, status } = await verifyOTPAndResetPasswordAPI(otp, newPassword);
      if (status === 200 && data.success === true) {
        toast.success(data.message || "Your password has been reset successfully!");
        return true;
      } else {
        toast.error(data.message || "Password reset failed. Please try again.");
        return false;
      }
    } catch (e) {
      if (axios.isAxiosError(e) && e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message);
      } else if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("Could not connect to the server or an unknown error occurred during password reset.");
      }
    }
    return false;
  };

  const sendSignupOtp = async (): Promise<boolean> => {
    try {
      const { data, status } = await sendSignupOtpAPI();
      if (status === 200 && data.success === true) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        toast.error("Network Error!");
      } else {
        toast.error("Could not connect to the server or an unknown error occurred while sending OTP.");
      }
      return false
    }
  };

  const verifySignupOtp = async (otp: string): Promise<boolean> => {
    try {
      const { data, status } = await verifySignupOtpAPI(otp);
      if (status === 200 && data.success === true) {
        toast.success(data.message || "Account verified successfully");
        return true;
      } else {
        toast.error(data.message || "OTP verification failed. Invalid code.");
        return false;
      }
    } catch (e) {
      if (axios.isAxiosError(e) && e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message);
      } else {
        toast.error("Could not connect to the server or an unknown error occurred during OTP verification.");
      }
    }
    return false;
  };

  return (
    <UserContext.Provider value={{ loginUser, user, logout, isLoggedIn, registerUser, isLoading,isVerified, forgotPassword, resetPasswordWithOTP, sendSignupOtp, verifySignupOtp }}>
      {!isLoading && children}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);