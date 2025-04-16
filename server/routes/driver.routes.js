
const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driver.controller');
const { authMiddleware, isEmployee, isDriver } = require('../middleware/auth');

// Get all drivers - accessible by employees
router.get('/', authMiddleware, driverController.getAllDrivers);

// Update driver availability - accessible by drivers
router.put('/availability', authMiddleware, isDriver, driverController.updateAvailability);

// Respond to a booking - accessible by drivers
router.post('/respond', authMiddleware, isDriver, driverController.respondToBooking);

// Get driver's bookings - accessible by drivers
router.get('/bookings', authMiddleware, isDriver, driverController.getDriverBookings);

module.exports = router;
