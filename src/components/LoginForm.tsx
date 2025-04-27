
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/services/api';
import { toast } from 'sonner';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  
  // Employee login state
  const [employeeId, setEmployeeId] = useState('');
  const [employeePassword, setEmployeePassword] = useState('');
  
  // Driver login state
  const [mobileNumber, setMobileNumber] = useState('');
  const [driverPassword, setDriverPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  // Effect to redirect user if already authenticated
  useEffect(() => {
    console.log("LoginForm auth state:", { isAuthenticated, userRole: user?.role });
    
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'teacher' 
        ? '/teacher-dashboard' 
        : '/driver-dashboard';
        
      console.log(`User authenticated, redirecting to: ${redirectPath}`);
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleEmployeeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!employeeId || !employeePassword) {
      toast.error('Please fill all the fields');
      return;
    }

    try {
      setIsLoading(true);
      
      // Prepare payload
      const payload = {
        employeeId,
        password: employeePassword,
        role: 'employee' as const
      };
      
      console.log('Employee login payload:', payload);
      
      // Make API call
      const response = await authAPI.login(payload);
      
      console.log('Login response:', response);
      
      // Update auth context
      login(response.token, response.user);
      toast.success('Login successful!');
    } catch (error: any) {
      console.error('Login error:', error);
      // Show more specific error message if available from the API response
      const errorMessage = error.response?.data?.message || 'Invalid credentials. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDriverLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!mobileNumber || !driverPassword) {
      toast.error('Please fill all the fields');
      return;
    }

    try {
      setIsLoading(true);
      
      // Prepare payload
      const payload = {
        mobileNumber,
        password: driverPassword,
        role: 'driver' as const
      };
      
      console.log('Driver login payload:', payload);
      
      // Make API call
      const response = await authAPI.login(payload);
      
      console.log('Login response:', response);
      
      // Update auth context
      login(response.token, response.user);
      toast.success('Login successful!');
    } catch (error: any) {
      console.error('Login error:', error);
      // Show more specific error message if available from the API response
      const errorMessage = error.response?.data?.message || 'Invalid credentials. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs defaultValue="teacher" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="teacher">Teacher</TabsTrigger>
          <TabsTrigger value="driver">Driver</TabsTrigger>
        </TabsList>
        
        <TabsContent value="teacher">
          <form onSubmit={handleEmployeeLogin} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                type="text"
                placeholder="Enter your Employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={employeePassword}
                onChange={(e) => setEmployeePassword(e.target.value)}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-cu-blue hover:bg-blue-800 text-white" 
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="driver">
          <form onSubmit={handleDriverLogin} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input
                id="mobileNumber"
                type="tel"
                placeholder="Enter your mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="driverPassword">Password</Label>
              <Input
                id="driverPassword"
                type="password"
                placeholder="Enter your password"
                value={driverPassword}
                onChange={(e) => setDriverPassword(e.target.value)}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-cu-blue hover:bg-blue-800 text-white" 
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoginForm;
