
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authMiddleware } = require('../middleware/auth');

// Get all employees and drivers
router.get('/employees', authMiddleware, adminController.getAllEmployees);
router.get('/drivers', authMiddleware, adminController.getAllDrivers);

// Delete all employees and drivers
router.delete('/employees', authMiddleware, adminController.deleteAllEmployees);
router.delete('/drivers', authMiddleware, adminController.deleteAllDrivers);
router.delete('/bookings', authMiddleware, adminController.deleteAllBookings);

// Create admin account
router.post('/create', adminController.createAdmin);

module.exports = router;
