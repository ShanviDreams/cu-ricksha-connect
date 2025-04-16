
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth.routes');
const driverRoutes = require('./routes/driver.routes');
const bookingRoutes = require('./routes/booking.routes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://akashlakhwan2329:dJ9oa05hjGmONfCP@cu-e-ricksha.57x2ymc.mongodb.net/cu-e-ricksha?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('driverStatusChange', (data) => {
    // Broadcast to all connected clients except sender
    socket.broadcast.emit('driverStatusUpdate', data);
  });
  
  socket.on('newBooking', (data) => {
    // Broadcast to all connected clients
    io.emit('bookingCreated', data);
  });
  
  socket.on('bookingResponse', (data) => {
    // Broadcast to all connected clients
    io.emit('bookingUpdated', data);
  });

  socket.on('accountDeleted', (data) => {
    // Broadcast to all connected clients
    io.emit('userRemoved', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/bookings', bookingRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('CU E-Rickshaw API is running');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
