
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authAPI } from '@/services/api';
import { toast } from 'sonner';

const SignupForm = () => {
  const navigate = useNavigate();
  
  // Teacher signup state
  const [teacherName, setTeacherName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Driver signup state
  const [driverName, setDriverName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  const handleTeacherSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName || !employeeId || !password || !confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authAPI.signup({
        name: teacherName,
        employeeId,
        password,
        role: 'teacher'
      });
      
      toast.success('Signup successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDriverSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName || !mobileNumber) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authAPI.signup({
        name: driverName,
        mobileNumber,
        role: 'driver'
      });
      
      toast.success('Signup successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Signup failed. Please try again.');
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
          <form onSubmit={handleTeacherSignup} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="teacherName">Full Name</Label>
              <Input
                id="teacherName"
                type="text"
                placeholder="Enter your full name"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
              />
            </div>
            
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-cu-blue hover:bg-blue-800 text-white" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="driver">
          <form onSubmit={handleDriverSignup} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="driverName">Full Name</Label>
              <Input
                id="driverName"
                type="text"
                placeholder="Enter your full name"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
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
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SignupForm;
