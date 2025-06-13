import type { UserProfile } from "@/models/User";
import React, { createContext, useEffect, useState } from "react";
import { loginAPI, registerAPI, logoutAPI, checkSessionAPI } from "@/services/AuthServices";
import { toast } from "react-toastify";

type UserContextType = {
  user: UserProfile | null;
  registerUser: (email: string, username: string, password: string) => Promise<boolean>;
  loginUser: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoggedIn: () => boolean;
  isLoading: boolean;
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await checkSessionAPI();
        if (response && response.user) {
          setUser(response.user);
        }
      } catch (error) {
        setUser(null);
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
      toast.error("Registration failed.");
      return false;
    }
  };

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await loginAPI(email, password);
      if (response && response.user) {
        setUser(response.user);
        toast.success("Login Success!");
        return true;
      }
      return false;
    } catch (e) {
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
      console.error("Logout failed", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ loginUser, user, logout, isLoggedIn, registerUser, isLoading }}>
      {!isLoading && children}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);