// src/lib/apiClient.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api/v1/auth',
  withCredentials: true,
});

apiClient.interceptors.request.use(config => {
  const csrfToken = Cookies.get('csrfToken');
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default apiClient;