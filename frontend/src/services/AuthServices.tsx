import apiClient from "@/lib/apiClient";
import { handleError } from "@/helper/ErrorHandler";
import type { AuthResponse } from "@/models/User";

export const loginAPI = async (email: string, password: string) => {
  try {
    const { data } = await apiClient.post<AuthResponse>('/login', {
      email: email,
      password: password
    });
    return data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export const registerAPI = async (email: string, userName: string, password: string) => {
  try {
    const { data } = await apiClient.post('/signup', {
      email: email,
      userName: userName,
      password: password
    });
    return data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export const logoutAPI = async () => {
  try {
    await apiClient.post('/logout');
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export const checkSessionAPI = async (): Promise<AuthResponse> => {
  const { data } = await apiClient.get<AuthResponse>('/authorizedPage');
  return data;
};