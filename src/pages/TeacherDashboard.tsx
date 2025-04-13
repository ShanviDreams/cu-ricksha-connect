
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DriverList from '@/components/DriverList';

const TeacherDashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== 'teacher')) {
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

  if (!isAuthenticated || user?.role !== 'teacher') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="cu-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Find and contact available e-rickshaw drivers
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <DriverList />
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
