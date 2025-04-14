
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DriverList from '@/components/DriverList';
import DeleteAccount from '@/components/DeleteAccount';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MessagesList from '@/components/MessagesList';

const TeacherDashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("drivers");

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
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome, {user.name}
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="drivers">Find Drivers</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
          <TabsContent value="drivers" className="mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <DriverList />
            </div>
          </TabsContent>
          <TabsContent value="messages" className="mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <MessagesList />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Account Management</h2>
          <DeleteAccount />
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
