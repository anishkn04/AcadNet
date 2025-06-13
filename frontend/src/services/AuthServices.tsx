import apiClient from "@/lib/apiClient";
import { handleError } from "@/helper/ErrorHandler";
;

export const loginAPI = async (email: string, password: string) => {
  try {
    const response = await apiClient.post<any>('/login', {
      email: email,
      password: password
    });
    return { data: response.data, status: response.status };
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export const registerAPI = async (email: string, username: string, password: string) => {
  try {
    const { data } = await apiClient.post('/signup', {
      email: email,
      username: username,
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

export const checkSessionAPI = async () => {
  try {
    const response = await apiClient.get<any>('/authorizedPage');
    return { data: response.data, status: response.status };
  } catch (error) {
    handleError(error);
    throw error;
  }
};