
import { io } from 'socket.io-client';

const SOCKET_URL = 'https://cu-e-ricksha-backend.onrender.com';

// Create socket instance
export const socket = io(SOCKET_URL);

// Socket service
const socketService = {
  // Initialize socket connection
  init: () => {
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return socket;
  },

  // Disconnect socket
  disconnect: () => {
    if (socket.connected) {
      socket.disconnect();
    }
  },

  // Emit driver status change
  emitDriverStatusChange: (driverId: string, isAvailable: boolean) => {
    socket.emit('driverStatusChange', { driverId, isAvailable });
  },

  // Subscribe to driver status updates
  subscribeToDriverUpdates: (callback: (data: { driverId: string, isAvailable: boolean }) => void) => {
    socket.on('driverStatusUpdate', callback);
  },

  // Unsubscribe from driver status updates
  unsubscribeFromDriverUpdates: () => {
    socket.off('driverStatusUpdate');
  }
};

export default socketService;
