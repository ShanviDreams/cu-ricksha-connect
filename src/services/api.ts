
import axios from 'axios';

const API_URL = 'https://cu-e-ricksha-backend.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication APIs
export const authAPI = {
  login: async (credentials: { 
    employeeId?: string; 
    password?: string; 
    name?: string; 
    mobileNumber?: string;
    role: 'teacher' | 'driver' 
  }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  signup: async (userData: {
    name: string;
    employeeId?: string;
    password?: string;
    mobileNumber?: string;
    role: 'teacher' | 'driver';
  }) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },
};

// Driver APIs
export const driverAPI = {
  updateAvailability: async (isAvailable: boolean) => {
    const response = await api.put('/drivers/availability', { isAvailable });
    return response.data;
  },
  
  getAllDrivers: async () => {
    const response = await api.get('/drivers');
    return response.data;
  },
};

export default api;
