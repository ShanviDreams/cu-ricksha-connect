
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authAPI } from '@/services/api';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const SignupForm = () => {
  const navigate = useNavigate();
  
  // Teacher signup state
  const [teacherName, setTeacherName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  
  // Driver signup state
  const [driverName, setDriverName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [driverPassword, setDriverPassword] = useState('');
  const [driverConfirmPassword, setDriverConfirmPassword] = useState('');
  const [rickshawNumber, setRickshawNumber] = useState('');
  const [location, setLocation] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('teacher');

  const clearError = () => setErrorMsg('');

  const validatePasswordStrength = (pwd: string) => {
    if (pwd.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return null;
  };

  const handleTeacherSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!teacherName || !employeeId || !password || !confirmPassword) {
      toast.error('Please fill all required fields');
      setErrorMsg('Please fill all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setErrorMsg('Passwords do not match');
      return;
    }

    const passwordError = validatePasswordStrength(password);
    if (passwordError) {
      toast.error(passwordError);
      setErrorMsg(passwordError);
      return;
    }

    try {
      setIsLoading(true);
      console.log('Teacher signup payload:', { 
        name: teacherName, 
        employeeId, 
        password: '[HIDDEN]', 
        department,
        position,
        role: 'teacher' 
      });
      
      const response = await authAPI.signup({
        name: teacherName,
        employeeId,
        password,
        department,
        position,
        role: 'teacher'
      });
      
      console.log('Signup successful:', response);
      toast.success('Signup successful! Please login.');
      navigate('/login');
    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(errorMessage);
      setErrorMsg(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDriverSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!driverName || !mobileNumber || !driverPassword || !driverConfirmPassword) {
      toast.error('Please fill all required fields');
      setErrorMsg('Please fill all required fields');
      return;
    }

    if (driverPassword !== driverConfirmPassword) {
      toast.error('Passwords do not match');
      setErrorMsg('Passwords do not match');
      return;
    }

    const passwordError = validatePasswordStrength(driverPassword);
    if (passwordError) {
      toast.error(passwordError);
      setErrorMsg(passwordError);
      return;
    }

    try {
      setIsLoading(true);
      console.log('Driver signup payload:', { 
        name: driverName, 
        mobileNumber, 
        password: '[HIDDEN]',
        rickshawNumber,
        location, 
        role: 'driver' 
      });
      
      const response = await authAPI.signup({
        name: driverName,
        mobileNumber,
        password: driverPassword,
        rickshawNumber,
        location,
        role: 'driver'
      });
      
      console.log('Signup successful:', response);
      toast.success('Signup successful! Please login.');
      navigate('/login');
    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(errorMessage);
      setErrorMsg(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    clearError();
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
          <form onSubmit={handleTeacherSignup} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="teacherName">Full Name*</Label>
              <Input
                id="teacherName"
                type="text"
                placeholder="Enter your full name"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID*</Label>
              <Input
                id="employeeId"
                type="text"
                placeholder="Enter your Employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                type="text"
                placeholder="Enter your department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                type="text"
                placeholder="Enter your position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password*</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password*</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="text-xs text-gray-500">Fields marked with * are required</div>
            
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
              <Label htmlFor="driverName">Full Name*</Label>
              <Input
                id="driverName"
                type="text"
                placeholder="Enter your full name"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number*</Label>
              <Input
                id="mobileNumber"
                type="tel"
                placeholder="Enter your mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rickshawNumber">Rickshaw Number</Label>
              <Input
                id="rickshawNumber"
                type="text"
                placeholder="Enter your rickshaw number"
                value={rickshawNumber}
                onChange={(e) => setRickshawNumber(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="driverPassword">Password*</Label>
              <Input
                id="driverPassword"
                type="password"
                placeholder="Create a password (min 6 characters)"
                value={driverPassword}
                onChange={(e) => setDriverPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="driverConfirmPassword">Confirm Password*</Label>
              <Input
                id="driverConfirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={driverConfirmPassword}
                onChange={(e) => setDriverConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="text-xs text-gray-500">Fields marked with * are required</div>
            
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
