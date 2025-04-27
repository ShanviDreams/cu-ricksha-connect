
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  role: 'teacher' | 'driver';  // Note: Internally we use 'teacher' but API uses 'employee'
  employeeId?: string;
  mobileNumber?: string;
  isAvailable?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUserAvailability?: (isAvailable: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("Restored user from localStorage:", parsedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        // Clear invalid storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    console.log("Login called with:", { token, userData });
    
    // Fix type comparison by checking against string value, not type
    // The API returns 'employee' as a string, not as a TypeScript type
    if (userData.role === 'employee' as any) {
      userData.role = 'teacher';
    }
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    
    console.log("Auth state updated:", { user: userData, isAuthenticated: true });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    console.log("User logged out, auth state reset");
  };

  const updateUserAvailability = (isAvailable: boolean) => {
    if (user && user.role === 'driver') {
      const updatedUser = { ...user, isAvailable };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading, 
      login, 
      logout, 
      updateUserAvailability 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
