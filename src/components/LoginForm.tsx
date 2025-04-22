
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/services/api';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Employee login state
  const [employeeId, setEmployeeId] = useState('');
  const [employeePassword, setEmployeePassword] = useState('');
  
  // Driver login state
  const [mobileNumber, setMobileNumber] = useState('');
  const [driverPassword, setDriverPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('teacher');

  const clearError = () => setErrorMsg('');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    clearError();
  };

  const handleEmployeeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!employeeId || !employeePassword) {
      toast.error('Please fill all the fields');
      setErrorMsg('Please fill all the fields');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Attempting employee login with:', { employeeId, password: '[HIDDEN]' });
      
      const response = await authAPI.login({
        employeeId,
        password: employeePassword,
        role: 'employee'
      });
      
      console.log('Login response:', response);
      login(response.token, response.user);
      toast.success('Login successful!');
      navigate('/teacher-dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Invalid credentials. Please try again.';
      toast.error(errorMessage);
      setErrorMsg(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDriverLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!mobileNumber || !driverPassword) {
      toast.error('Please fill all the fields');
      setErrorMsg('Please fill all the fields');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Attempting driver login with:', { mobileNumber, password: '[HIDDEN]' });
      
      const response = await authAPI.login({
        mobileNumber,
        password: driverPassword,
        role: 'driver'
      });
      
      console.log('Login response:', response);
      login(response.token, response.user);
      toast.success('Login successful!');
      navigate('/driver-dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Invalid credentials. Please try again.';
      toast.error(errorMessage);
      setErrorMsg(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {errorMsg && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="teacher" value={activeTab} onValueChange={handleTabChange} className="w-full">
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
                disabled={isLoading}
                required
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
                disabled={isLoading}
                required
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
                disabled={isLoading}
                required
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
                disabled={isLoading}
                required
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
