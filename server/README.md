
# CU E-Ricksha Backend

Backend API for the CU E-Ricksha application, which connects teachers and e-rickshaw drivers at Chandigarh University.

## Features

- JWT Authentication for teachers and drivers
- MongoDB database integration
- Real-time updates using Socket.IO
- Express API routes
- Role-based access control

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
   JWT_SECRET=cu_ericksha@2024
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

## API Endpoints

### Authentication

- `POST /api/auth/teacher/signup` - Register a new teacher
- `POST /api/auth/teacher/login` - Teacher login
- `POST /api/auth/driver/signup` - Register a new driver
- `POST /api/auth/driver/login` - Driver login

### Drivers

- `GET /api/drivers` - Get all drivers (requires authentication)
- `PUT /api/drivers/availability` - Update driver availability status (requires authentication)

## Socket.IO Events

### Client to Server
- `driverStatusChange` - Emitted when a driver changes their availability status

### Server to Client
- `driverStatusUpdate` - Broadcasted to all clients when a driver updates their status

## Deployment (Render)

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Use the following settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add the following environment variables:
   - `PORT`
   - `MONGODB_URI`
   - `JWT_SECRET`
5. Enable the "WebSockets" option in the Web Service settings

## License

ISC
