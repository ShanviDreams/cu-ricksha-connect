
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  role: 'teacher' | 'driver';
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
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
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
