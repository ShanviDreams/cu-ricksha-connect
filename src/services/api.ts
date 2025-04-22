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
  timeout: 60000, // Increase timeout to 60 seconds for slow connections
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log outgoing requests for debugging
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, 
      config.data ? { ...config.data, password: config.data.password ? '[HIDDEN]' : undefined } : '');
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} from ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('API Error Details:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      stack: isDev ? error.stack : undefined
    });
    return Promise.reject(error);
  }
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
      // Convert 'teacher' role to 'employee' for API consistency
      const apiRole = credentials.role === 'teacher' ? 'employee' : credentials.role;
      
      const endpoint = apiRole === 'employee' 
        ? '/auth/employee/login' 
        : '/auth/driver/login';
        
      console.log('Sending login request to:', endpoint, 'with data:', { 
        ...credentials, 
        password: credentials.password ? '[HIDDEN]' : undefined 
      });
      
      const response = await api.post(endpoint, {
        employeeId: credentials.employeeId,
        mobileNumber: credentials.mobileNumber,
        password: credentials.password
      });
      
      console.log('Login response:', {
        success: true,
        token: response.data.token ? '[PRESENT]' : '[MISSING]',
        user: response.data.user
      });
      
      // Store token in localStorage
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } else {
        throw new Error('No token received from server');
      }
      
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
      // Convert 'teacher' role to 'employee' for API consistency
      const apiRole = userData.role === 'teacher' ? 'employee' : userData.role;
      
      // Determine the correct endpoint based on the role
      const endpoint = apiRole === 'employee' 
        ? '/auth/employee/signup' 
        : '/auth/driver/signup';
        
      // Log request details for debugging
      console.log('Sending signup request to:', endpoint);
      
      // Create a clean request object with only the fields needed by the API
      let requestData;
      
      if (apiRole === 'employee') {
        requestData = {
          name: userData.name,
          employeeId: userData.employeeId,
          password: userData.password,
          department: userData.department || '',
          position: userData.position || ''
        };
      } else {
        requestData = {
          name: userData.name,
          mobileNumber: userData.mobileNumber,
          password: userData.password,
          rickshawNumber: userData.rickshawNumber || '',
          location: userData.location || ''
        };
      }
      
      console.log('Final request data:', { 
        ...requestData, 
        password: requestData.password ? '[HIDDEN]' : undefined 
      });
      
      const response = await api.post(endpoint, requestData);
      console.log('Signup response:', {
        success: true,
        token: response.data.token ? '[PRESENT]' : '[MISSING]',
        user: response.data.user
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Signup API error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        endpoint: error.config?.url
      });
      throw error;
    }
  },
  
  deleteAccount: async (role: string) => {
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
