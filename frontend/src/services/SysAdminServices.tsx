// SysAdmin API Services
import apiClient from '@/lib/apiClient';

// Dashboard APIs
export const getSysAdminDashboardAPI = async () => {
  try {
    const response = await apiClient.get('/sysadmin/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStatsAPI = async () => {
  try {
    const response = await apiClient.get('/sysadmin/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// User Management APIs
export const listAllUsersAPI = async () => {
  try {
    const response = await apiClient.get('/sysadmin/users');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUserByIdAPI = async (userId: string) => {
  try {
    const response = await apiClient.delete(`/sysadmin/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchUserByUsernameAPI = async (username: string) => {
  try {
    const response = await apiClient.get(`/sysadmin/search/user?username=${username}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Group Management APIs
export const listAllGroupsAPI = async () => {
  try {
    const response = await apiClient.get('/sysadmin/groups');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteGroupByIdAPI = async (groupId: string) => {
  try {
    const response = await apiClient.delete(`/sysadmin/group/${groupId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchGroupByNameAPI = async (groupname: string) => {
  try {
    const response = await apiClient.get(`/sysadmin/search/group?groupname=${groupname}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
