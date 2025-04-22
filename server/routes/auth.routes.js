
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth');

// Employee routes
router.post('/employee/signup', authController.employeeSignup);
router.post('/employee/login', authController.employeeLogin);

// Driver routes
router.post('/driver/signup', authController.driverSignup);
router.post('/driver/login', authController.driverLogin);

// Get current user
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;
