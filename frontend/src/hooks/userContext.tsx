import type { UserProfile } from "@/models/User";
import React, { createContext, useEffect, useState } from "react";
import { loginAPI, registerAPI, logoutAPI, checkSessionAPI, forgotPasswordAPI, verifyOTPAndResetPasswordAPI,sendSignupOtpAPI, verifySignupOtpAPI } from "@/services/AuthServices";
import { toast } from "react-toastify";
import axios from 'axios';


type UserContextType = {
  user: UserProfile | null;
  registerUser: (email: string, username: string, password: string) => Promise<boolean>;
  loginUser: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoggedIn: () => boolean;
  isLoading: boolean;
  forgotPassword: (email:string)=>Promise<boolean>;
  resetPasswordWithOTP:(otp:string,newPassword:string)=>Promise<boolean>;
  sendSignupOtp:()=>Promise<boolean>;
  verifySignupOtp:(otp:string) =>Promise<boolean>;
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data, status } = await checkSessionAPI();
        if (status === 200 && data.success === true) {
          setUser({ userName: "Authenticated User", email: "user@example.com" });
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
        
        console.error("Session check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    verifyUser();
  }, []);

  const registerUser = async (email: string, username: string, password: string): Promise<boolean> => {
    try {
      await registerAPI(email, username, password);
      toast.success("Register Success! Please log in.");
      return true;
    } catch (e) {
      if (axios.isAxiosError(e) && e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message);
      } else {
        toast.error("Registration failed.");
      }
      console.error("Registration failed in context:", e);
      return false;
    }
  };

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, status } = await loginAPI(email, password);
      if (status === 200 && data.success === true) {
        setUser({ userName: "Authenticated User", email: "user@example.com" });
        toast.success("Login Success!");
        return true;
      } else {
        toast.error("Login failed. Please check your credentials.");
        return false;
      }
    } catch (e: any) {
      console.error("Login failed in context:", e);
      if (axios.isAxiosError(e) && e.response && e.response.data && e.response.data.message) {
        if (e.response.status === 409 && e.response.data.message === "Please Login via GitHub") {
          toast.error("You registered with GitHub. Please log in using GitHub.");
        } else if (e.response.data.message === "Login Error: User not Found" || e.response.data.message === "Login Error: Wrong Credentials") {
          toast.error("Invalid email or password. Please try again.");
        } else {
          toast.error(e.response.data.message);
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
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setUser(null);
      toast.info("You have been logged out.");
    }
  };

  const forgotPassword =  async(email:string): Promise<boolean>=>{
    try{
      const {data,status} = await forgotPasswordAPI(email);
      if(status === 200 && data.success === true ){
        toast.success(data.message || "Password reset OTP has sent to your email!")
        return true
      }else{
        toast.error(data.message || "Failed to send OTP. Please check the email address.")
        return false;
      }
    }catch(e){
      if (axios.isAxiosError(e) && e.response && e.response.data && e.response.data.message){
        console.log(e.response.data.message)
      }else{
        toast.error("Could not connect to the server or an unknown error occurred.");
      }
    }
    return false;
  }
  const resetPasswordWithOTP =  async(otp:string,newPassword:string): Promise<boolean>=>{
    try{
      const {data,status} = await verifyOTPAndResetPasswordAPI(otp,newPassword);
      if (status === 200 && data.success === true){
        toast.success(data.message || "Your password has been reset successfully!");
        return true
      }else{
        toast.error(data.message || "Password reset failed. Please try again.")
        return false
      }
    }catch(e){
           if (axios.isAxiosError(e) && e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message);
      } else if (e instanceof Error) {
        console.log(e.message);
      } else {
        toast.error("Could not connect to the server or an unknown error occurred during password reset.");
      }
    }
    return false;
  };
  const sendSignupOtp = async ():Promise<boolean>=>{
    try{
      const {data,status} = await sendSignupOtpAPI();
      if(status === 200 && data.success === true){
        toast.success(data.message || "OTP sent to your email");
        return true;
      }else{
        toast.error(data.message || "Failed to sent OTP.");
        return false;
      }
    }catch(e){
      console.error("Send signup OTP failed in context:", e);
      if (axios.isAxiosError(e) && e.response && e.response.data && e.response.data.message) {
        console.log(e.response.data.message);
      } else {
        toast.error("Could not connect to the server or an unknown error occurred while sending OTP.");
        console.log("Could not connect to the server or an unknown error occurred while sending OTP.");
      }
    }
    return false
  };
  const verifySignupOtp = async (otp:string): Promise<boolean>=>{
    try{
      const {data,status} = await verifySignupOtpAPI(otp);
      if(status ===200 && data.success === true){
        toast.success(data.message || "Account verified successfully");
        return true;
      }else{
        toast.error(data.message || "OTP verification failed. Invalid code.");
        return false;
      }
      
    }catch(e){
      console.error("Verify signup OTP failed in context:", e);
      if (axios.isAxiosError(e) && e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message);
      } else {
        toast.error("Could not connect to the server or an unknown error occurred during OTP verification.");
      }
    }
    return false;
  }
  return (
    <UserContext.Provider value={{ loginUser, user, logout, isLoggedIn, registerUser, isLoading,forgotPassword,resetPasswordWithOTP,sendSignupOtp,verifySignupOtp }}>
      {!isLoading && children}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);