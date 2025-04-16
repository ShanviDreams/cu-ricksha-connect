
# CU E-Rickshaw Backend

Backend API for the CU E-Rickshaw application, which connects employees (teachers) and e-rickshaw drivers at Chandigarh University.

## Features

- JWT Authentication for employees and drivers
- MongoDB database integration
- Real-time updates using Socket.IO
- Express API routes
- Role-based access control
- Booking system with driver responses

## Prerequisites

- Node.js (v14+ recommended)
- MongoDB Atlas account (or MongoDB installed locally)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://akashlakhwan2329:dJ9oa05hjGmONfCP@cu-e-ricksha.57x2ymc.mongodb.net/cu-e-ricksha
   JWT_SECRET=cu_ericksha_secret_2024@akash
   ```

## Running the Server

### Development mode
```bash
npm run dev
```

### Production mode
```bash
npm start
```

### Clear Database
```bash
npm run clear-db
```

## API Endpoints

### Authentication

- `POST /api/auth/employee/signup` - Register a new employee
- `POST /api/auth/employee/login` - Employee login
- `POST /api/auth/driver/signup` - Register a new driver
- `POST /api/auth/driver/login` - Driver login
- `GET /api/auth/me` - Get current user information

### Drivers

- `GET /api/drivers` - Get all drivers 
- `PUT /api/drivers/availability` - Update driver availability status
- `POST /api/drivers/respond` - Respond to a booking request (green/orange)
- `GET /api/drivers/bookings` - Get driver's bookings

### Bookings

- `POST /api/bookings` - Create a new booking
- `GET /api/bookings` - Get all bookings (filtered by role)
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/status` - Update booking status

### Admin

- `POST /api/admin/clear-all` - Clear all data from database
- `POST /api/admin/clear-employees` - Clear all employees
- `POST /api/admin/clear-drivers` - Clear all drivers

## Socket.IO Events

### Client to Server
- `driverStatusChange` - Emitted when a driver changes their availability status
- `newBooking` - Emitted when a new booking is created
- `bookingResponse` - Emitted when a driver responds to a booking

### Server to Client
- `driverStatusUpdate` - Broadcasted to all clients when a driver updates their status
- `bookingCreated` - Broadcasted to all clients when a new booking is created
- `bookingUpdated` - Broadcasted to all clients when a booking is updated

## Project Structure

```
server/
│
├── controllers/            # Request handlers
│   ├── admin.controller.js
│   ├── auth.controller.js
│   ├── booking.controller.js
│   └── driver.controller.js
│
├── middleware/
│   └── auth.js            # Authentication middleware
│
├── models/                # Mongoose models
│   ├── Booking.js
│   ├── Driver.js
│   └── Employee.js
│
├── routes/                # API routes
│   ├── admin.routes.js
│   ├── auth.routes.js
│   ├── booking.routes.js
│   └── driver.routes.js
│
├── scripts/
│   └── clearDatabase.js   # Script to clear database
│
├── .env                   # Environment variables
├── app.js                 # Express app setup
├── server.js              # Server entry point
└── package.json
```

## License

ISC
