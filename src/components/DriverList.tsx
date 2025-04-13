
import { useEffect, useState } from 'react';
import { driverAPI } from '@/services/api';
import DriverCard from './DriverCard';
import { toast } from 'sonner';

interface Driver {
  _id: string;
  name: string;
  mobileNumber: string;
  isAvailable: boolean;
}

const DriverList = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

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
    
    // Poll for driver updates every 10 seconds
    const interval = setInterval(fetchDrivers, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Available Drivers</h2>
        <button 
          onClick={fetchDrivers}
          className="text-sm flex items-center text-primary hover:underline"
        >
          Refresh
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : drivers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drivers.map((driver) => (
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
          No drivers available at the moment.
        </div>
      )}
    </div>
  );
};

export default DriverList;
