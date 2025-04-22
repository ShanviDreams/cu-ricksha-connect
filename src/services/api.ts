
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

// Mock data for development/testing - removing test and busy driver
const mockUsers = {
  teachers: [
    { id: 'teacher1', name: 'Test Teacher', employeeId: 'T12345', role: 'teacher' }
  ],
  drivers: [],
  messages: []
};

// Authentication APIs
export const authAPI = {
  login: async (credentials: { 
    employeeId?: string; 
    password?: string; 
    mobileNumber?: string;
    role: 'teacher' | 'driver' | 'employee'
  }) => {
    if (isDev) {
      console.log('Using mock login for development');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      if (credentials.role === 'teacher' || credentials.role === 'employee') {
        const teacher = mockUsers.teachers.find(t => t.employeeId === credentials.employeeId);
        if (teacher) {
          // Store credentials in localStorage for development
          localStorage.setItem('dev_credentials', JSON.stringify({
            type: 'teacher',
            employeeId: credentials.employeeId,
            password: credentials.password
          }));
          return { token: 'mock-token', user: teacher };
        }
      } else {
        const driver = mockUsers.drivers.find(d => d.mobileNumber === credentials.mobileNumber);
        if (driver) {
          // Store credentials in localStorage for development
          localStorage.setItem('dev_credentials', JSON.stringify({
            type: 'driver',
            mobileNumber: credentials.mobileNumber,
            password: credentials.password
          }));
          return { token: 'mock-token', user: driver };
        }
      }
      throw new Error('Invalid credentials');
    }

    const endpoint = credentials.role === 'teacher' || credentials.role === 'employee' 
      ? '/auth/employee/login' 
      : '/auth/driver/login';
      
    try {
      console.log('Sending login request to:', endpoint, credentials);
      const response = await api.post(endpoint, credentials);
      console.log('Login response:', response.data);
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
  }) => {
    if (isDev) {
      console.log('Using mock signup for development');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      if (userData.role === 'teacher' || userData.role === 'employee') {
        const newTeacher = { 
          id: `teacher${Date.now()}`, 
          name: userData.name, 
          employeeId: userData.employeeId, 
          role: 'teacher' 
        };
        mockUsers.teachers.push(newTeacher);
        
        // Store credentials in localStorage for development
        localStorage.setItem('dev_credentials', JSON.stringify({
          type: 'teacher',
          employeeId: userData.employeeId,
          password: userData.password
        }));
        
        return { token: 'mock-token', user: newTeacher };
      } else {
        const newDriver = { 
          id: `driver${Date.now()}`, 
          name: userData.name, 
          mobileNumber: userData.mobileNumber,
          isAvailable: false, 
          role: 'driver' 
        };
        mockUsers.drivers.push(newDriver);
        
        // Store credentials in localStorage for development
        localStorage.setItem('dev_credentials', JSON.stringify({
          type: 'driver',
          mobileNumber: userData.mobileNumber,
          password: userData.password
        }));
        
        return { token: 'mock-token', user: newDriver };
      }
    }

    const endpoint = userData.role === 'teacher' || userData.role === 'employee'
      ? '/auth/employee/signup' 
      : '/auth/driver/signup';
      
    try {
      console.log('Sending signup request to:', endpoint, userData);
      const response = await api.post(endpoint, userData);
      console.log('Signup response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Signup API error:', error);
      throw error;
    }
  },

  // Delete account method
  deleteAccount: async (userId: string, role: 'teacher' | 'driver' | 'employee') => {
    if (isDev) {
      console.log('Using mock account deletion for development');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      if (role === 'teacher' || role === 'employee') {
        mockUsers.teachers = mockUsers.teachers.filter(t => t.id !== userId);
        // Clear stored credentials
        localStorage.removeItem('dev_credentials');
      } else {
        mockUsers.drivers = mockUsers.drivers.filter(d => d.id !== userId);
        // Clear stored credentials
        localStorage.removeItem('dev_credentials');
      }
      return { success: true, message: 'Account deleted successfully' };
    }

    const endpoint = `/auth/${role === 'teacher' || role === 'employee' ? 'employee' : 'driver'}/delete-account`;
    try {
      console.log('Sending delete account request to:', endpoint);
      const response = await api.delete(endpoint);
      console.log('Delete account response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Account deletion API error:', error);
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
      return mockUsers.drivers;
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
        from: mockUsers.teachers[0].id, // Assuming current user is the first teacher
        to,
        text,
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      
      mockUsers.messages.push(message);
      return message;
    }
    
    const response = await api.post('/messages', { to, text });
    return response.data;
  },
  
  getMessages: async () => {
    if (isDev) {
      console.log('Getting mock messages');
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockUsers.messages;
    }
    
    const response = await api.get('/messages');
    return response.data;
  },
  
  updateMessageStatus: async (messageId: string, status: 'accepted' | 'rejected') => {
    if (isDev) {
      console.log(`Mock: Updating message ${messageId} status to ${status}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const message = mockUsers.messages.find(m => m.id === messageId);
      if (message) {
        message.status = status;
      }
      
      return { success: true, message };
    }
    
    const response = await api.put(`/messages/${messageId}/status`, { status });
    return response.data;
  },
};

export default api;
