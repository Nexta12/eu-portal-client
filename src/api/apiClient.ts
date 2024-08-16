import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getLocalStorageItem } from '@utils/localStorage';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const authToken = getLocalStorageItem('token');
    const { headers } = config;
    if (authToken) {
      headers.authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

export default apiClient;
