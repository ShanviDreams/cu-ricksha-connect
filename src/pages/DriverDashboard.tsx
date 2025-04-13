
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AvailabilityToggle from '@/components/AvailabilityToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DriverDashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== 'driver')) {
      navigate('/login');
    }
  }, [isAuthenticated, user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'driver') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="cu-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Driver Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your availability and view ride requests
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Availability Toggle */}
          <div className="md:col-span-1">
            <AvailabilityToggle />
          </div>
          
          {/* Driver Information */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Name</div>
                    <div className="font-medium">{user.name}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Mobile Number</div>
                    <div className="font-medium">{user.mobileNumber}</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Driver ID</div>
                  <div className="font-medium">{user.id}</div>
                </div>
                
                <div className="pt-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">How It Works</div>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                    <li>Set your availability status to let teachers know you're available for rides</li>
                    <li>Teachers can see your contact details when you're available</li>
                    <li>Teachers can contact you directly via call or SMS</li>
                    <li>You will only be visible to teachers when your status is set to "Available"</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
