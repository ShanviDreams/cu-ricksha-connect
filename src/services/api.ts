
import axios from 'axios';

// Use environment variable if available, otherwise use development URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Flag for development mode
const isDev = import.meta.env.DEV && !import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add a longer timeout for slower connections
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

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Mock data for development/testing
const mockUsers = {
  teachers: [
    { id: 'teacher1', name: 'Test Teacher', employeeId: 'T12345', role: 'employee' }
  ],
  drivers: [
    { id: 'driver1', name: 'Test Driver', mobileNumber: '1234567890', isAvailable: true, role: 'driver' },
    { id: 'driver2', name: 'Busy Driver', mobileNumber: '0987654321', isAvailable: false, role: 'driver' }
  ],
  messages: [
    { id: 'msg1', from: 'teacher1', to: 'driver1', text: 'Can you pick me up from Science Block at 2pm?', status: 'pending', timestamp: new Date().toISOString() }
  ]
};

// Authentication APIs
export const authAPI = {
  login: async (credentials: { 
    employeeId?: string; 
    password?: string; 
    mobileNumber?: string;
    role: 'employee' | 'driver'
  }) => {
    if (isDev) {
      console.log('Using mock login for development');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      if (credentials.role === 'employee') {
        // For testing, accept CU12345 as a valid employeeId with any password
        if (credentials.employeeId === 'CU12345') {
          const teacher = {
            id: 'teacher_mock',
            name: 'Test Teacher',
            employeeId: credentials.employeeId,
            role: 'employee'
          };
          return { token: 'mock-token', user: teacher };
        }
        
        const teacher = mockUsers.teachers.find(t => t.employeeId === credentials.employeeId);
        if (teacher) {
          return { token: 'mock-token', user: teacher };
        }
      } else {
        const driver = mockUsers.drivers.find(d => d.mobileNumber === credentials.mobileNumber);
        if (driver) {
          return { token: 'mock-token', user: driver };
        }
      }
      throw new Error('Invalid credentials');
    }

    const endpoint = credentials.role === 'employee' 
      ? '/auth/employee/login' 
      : '/auth/driver/login';
      
    try {
      console.log(`Making login request to ${endpoint}`, credentials);
      const response = await api.post(endpoint, credentials);
      console.log('Login response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Login API error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  signup: async (userData: {
    name: string;
    employeeId?: string;
    password?: string;
    mobileNumber?: string;
    role: 'employee' | 'driver';
  }) => {
    if (isDev) {
      console.log('Using mock signup for development');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      if (userData.role === 'employee') {
        // Check if employee already exists
        if (mockUsers.teachers.some(t => t.employeeId === userData.employeeId)) {
          throw new Error('Employee ID already exists');
        }
        
        const newTeacher = { 
          id: `teacher${Date.now()}`, 
          name: userData.name, 
          employeeId: userData.employeeId, 
          role: 'employee' 
        };
        mockUsers.teachers.push(newTeacher);
        return { token: 'mock-token', user: newTeacher };
      } else {
        // Check if driver already exists
        if (mockUsers.drivers.some(d => d.mobileNumber === userData.mobileNumber)) {
          throw new Error('Mobile number already exists');
        }
        
        const newDriver = { 
          id: `driver${Date.now()}`, 
          name: userData.name, 
          mobileNumber: userData.mobileNumber,
          isAvailable: false, 
          role: 'driver' 
        };
        mockUsers.drivers.push(newDriver);
        return { token: 'mock-token', user: newDriver };
      }
    }

    const endpoint = userData.role === 'employee'
      ? '/auth/employee/signup' 
      : '/auth/driver/signup';
      
    try {
      console.log(`Making signup request to ${endpoint}`, userData);
      const response = await api.post(endpoint, userData);
      console.log('Signup response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Signup API error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Method for deleting account
  deleteAccount: async (userId: string, role: 'employee' | 'driver') => {
    if (isDev) {
      console.log('Using mock account deletion for development');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      if (role === 'employee') {
        mockUsers.teachers = mockUsers.teachers.filter(t => t.id !== userId);
      } else {
        mockUsers.drivers = mockUsers.drivers.filter(d => d.id !== userId);
      }
      return { success: true, message: 'Account deleted successfully' };
    }

    const endpoint = `/auth/${role}/delete-account`;
    try {
      const response = await api.delete(endpoint);
      return response.data;
    } catch (error: any) {
      console.error('Account deletion API error:', error.response?.data || error.message);
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
