
import { useState } from 'react';
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
  const { login } = useAuth();
  
  // Teacher login state
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  
  // Driver login state
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !password) {
      toast.error('Please fill all the fields');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authAPI.login({
        employeeId,
        password,
        role: 'teacher'
      });
      
      login(response.token, response.user);
      toast.success('Login successful!');
      navigate('/teacher-dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDriverLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobileNumber) {
      toast.error('Please fill all the fields');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authAPI.login({
        name,
        mobileNumber,
        role: 'driver'
      });
      
      login(response.token, response.user);
      toast.success('Login successful!');
      navigate('/driver-dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid credentials. Please try again.');
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
          <form onSubmit={handleTeacherLogin} className="space-y-4 pt-4">
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
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
