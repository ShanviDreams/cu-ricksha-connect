
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { authMiddleware, isEmployee, isDriver } = require('../middleware/auth');

// Create new booking - only for employees
router.post('/', authMiddleware, isEmployee, bookingController.createBooking);

// Get all bookings - employees see their own, drivers see all pending
router.get('/', authMiddleware, bookingController.getAllBookings);

// Get booking by ID
router.get('/:id', authMiddleware, bookingController.getBookingById);

// Update booking status
router.put('/:id/status', authMiddleware, bookingController.updateBookingStatus);

module.exports = router;
