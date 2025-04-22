import axios from 'axios';

// Use environment variable if available, otherwise use the production URL
const API_URL = 'https://cu-e-ricksha-backend.onrender.com/api';

// Flag for development mode
const isDev = import.meta.env.DEV;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add a longer timeout for Render's free tier cold starts
  timeout: 30000,
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
    mobileNumber?: string;
    role: 'teacher' | 'driver' | 'employee'
  }) => {
    try {
      const endpoint = credentials.role === 'teacher' || credentials.role === 'employee' 
        ? '/auth/employee/login' 
        : '/auth/driver/login';
        
      console.log('Sending login request to:', endpoint, 'with data:', { 
        ...credentials, 
        password: credentials.password ? '[HIDDEN]' : undefined 
      });
      
      const response = await api.post(endpoint, credentials);
      console.log('Login response:', response.data);
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },
  
  signup: async (userData: {
    name: string;
    employeeId?: string;
    password?: string;
    mobileNumber?: string;
    role: 'teacher' | 'driver' | 'employee';
    department?: string;
    position?: string;
    rickshawNumber?: string;
    location?: string;
  }) => {
    try {
      const endpoint = userData.role === 'teacher' || userData.role === 'employee'
        ? '/auth/employee/signup' 
        : '/auth/driver/signup';
        
      console.log('Sending signup request to:', endpoint, 'with data:', { 
        ...userData, 
        password: userData.password ? '[HIDDEN]' : undefined 
      });
      
      const response = await api.post(endpoint, userData);
      console.log('Signup response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Signup API error:', error);
      throw error;
    }
  },

  // Delete account method
  deleteAccount: async (role: 'teacher' | 'driver' | 'employee') => {
    try {
      const endpoint = `/auth/${role === 'teacher' || role === 'employee' ? 'employee' : 'driver'}/delete-account`;
      
      console.log('Sending delete account request to:', endpoint);
      const response = await api.delete(endpoint);
      console.log('Delete account response:', response.data);
      
      // Clear credentials from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return response.data;
    } catch (error) {
      console.error('Account deletion API error:', error);
      throw error;
    }
  },
  
  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }
};

// Driver APIs
export const driverAPI = {
  updateAvailability: async (isAvailable: boolean) => {
    if (isDev) {
      console.log(`Mock: Setting driver availability to ${isAvailable}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, isAvailable };
    }
    
    const response = await api.put('/drivers/availability', { isAvailable });
    return response.data;
  },
  
  getAllDrivers: async () => {
    if (isDev) {
      console.log('Getting all mock drivers (including unavailable ones)');
      await new Promise(resolve => setTimeout(resolve, 500));
      return [];
    }
    
    const response = await api.get('/drivers');
    return response.data;
  },
};

// Message APIs
export const messageAPI = {
  sendMessage: async (to: string, text: string) => {
    if (isDev) {
      console.log(`Mock: Sending message to ${to}: ${text}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const message = {
        id: `msg${Date.now()}`,
        from: 'teacher1', // Assuming current user is the first teacher
        to,
        text,
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      
      return message;
    }
    
    const response = await api.post('/messages', { to, text });
    return response.data;
  },
  
  getMessages: async () => {
    if (isDev) {
      console.log('Getting mock messages');
      await new Promise(resolve => setTimeout(resolve, 500));
      return [];
    }
    
    const response = await api.get('/messages');
    return response.data;
  },
  
  updateMessageStatus: async (messageId: string, status: 'accepted' | 'rejected') => {
    if (isDev) {
      console.log(`Mock: Updating message ${messageId} status to ${status}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true, message: {id: messageId, status} };
    }
    
    const response = await api.put(`/messages/${messageId}/status`, { status });
    return response.data;
  },
};

export default api;
