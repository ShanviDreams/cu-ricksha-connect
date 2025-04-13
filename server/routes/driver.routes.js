
const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driver.controller');
const authMiddleware = require('../middleware/auth');

// Get all drivers - accessible by teachers
router.get('/', authMiddleware, driverController.getAllDrivers);

// Update driver availability - accessible by drivers
router.put('/availability', authMiddleware, driverController.updateAvailability);

module.exports = router;
