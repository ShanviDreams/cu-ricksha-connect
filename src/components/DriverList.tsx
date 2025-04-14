
import { useEffect, useState } from 'react';
import { driverAPI } from '@/services/api';
import socketService from '@/services/socket';
import DriverCard from './DriverCard';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Driver {
  _id: string;
  name: string;
  mobileNumber: string;
  isAvailable: boolean;
}

const DriverList = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'available' | 'unavailable'>('all');

  const fetchDrivers = async () => {
    try {
      const data = await driverAPI.getAllDrivers();
      setDrivers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast.error('Failed to load drivers');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
    
    // Initialize socket connection
    const socket = socketService.init();
    
    // Subscribe to driver status updates
    socketService.subscribeToDriverUpdates(({ driverId, isAvailable }) => {
      setDrivers(prevDrivers => 
        prevDrivers.map(driver => 
          driver._id === driverId 
            ? { ...driver, isAvailable } 
            : driver
        )
      );
    });
    
    return () => {
      // Cleanup socket listeners
      socketService.unsubscribeFromDriverUpdates();
      socketService.disconnect();
    };
  }, []);

  // Filter drivers based on active tab
  const filteredDrivers = drivers.filter(driver => {
    if (activeTab === 'all') return true;
    if (activeTab === 'available') return driver.isAvailable;
    if (activeTab === 'unavailable') return !driver.isAvailable;
    return true;
  });

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Drivers</h2>
        <button 
          onClick={fetchDrivers}
          className="text-sm flex items-center text-primary hover:underline"
        >
          Refresh
        </button>
      </div>

      <Tabs 
        defaultValue="all"
        className="mb-6"
        onValueChange={(value) => setActiveTab(value as 'all' | 'available' | 'unavailable')}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Drivers</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="unavailable">Unavailable</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredDrivers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDrivers.map((driver) => (
            <DriverCard
              key={driver._id}
              id={driver._id}
              name={driver.name}
              mobileNumber={driver.mobileNumber}
              isAvailable={driver.isAvailable}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          No drivers found in this category.
        </div>
      )}
    </div>
  );
};

export default DriverList;
