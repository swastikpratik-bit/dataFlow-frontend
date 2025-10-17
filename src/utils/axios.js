import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
});

// Request interceptor to add Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
    return Promise.reject(error);
  }
);

export default api;