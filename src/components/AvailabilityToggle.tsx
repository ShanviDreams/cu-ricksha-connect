
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { driverAPI } from '@/services/api';
import socketService from '@/services/socket';
import { toast } from 'sonner';
import { Check, X } from 'lucide-react';

const AvailabilityToggle = () => {
  const { user, updateUserAvailability } = useAuth();
  const [isAvailable, setIsAvailable] = useState<boolean>(user?.isAvailable || false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setIsAvailable(user.isAvailable || false);
    }
  }, [user]);

  const toggleAvailability = async () => {
    try {
      setIsLoading(true);
      const newStatus = !isAvailable;
      await driverAPI.updateAvailability(newStatus);
      setIsAvailable(newStatus);
      
      if (updateUserAvailability) {
        updateUserAvailability(newStatus);
      }
      
      // Emit status change to other clients via Socket.IO
      if (user) {
        socketService.emitDriverStatusChange(user.id, newStatus);
      }
      
      toast.success(`You are now ${newStatus ? 'available' : 'unavailable'} for rides`);
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Failed to update availability');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Your Current Status</h2>
      
      <div className={`mb-6 p-4 rounded-full ${
        isAvailable 
          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
      }`}>
        <div className="flex items-center space-x-2">
          {isAvailable ? (
            <Check className="h-6 w-6" />
          ) : (
            <X className="h-6 w-6" />
          )}
          <span className="font-medium text-lg">
            {isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>
      
      <Button
        onClick={toggleAvailability}
        disabled={isLoading}
        className={`w-full ${
          isAvailable 
            ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
            : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
        size="lg"
      >
        {isLoading ? 'Updating...' : isAvailable ? 'Set as Unavailable' : 'Set as Available'}
      </Button>
      
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
        {isAvailable 
          ? 'Teachers can see your details and contact you for rides.' 
          : 'You will not receive ride requests while unavailable.'}
      </p>
    </div>
  );
};

export default AvailabilityToggle;
