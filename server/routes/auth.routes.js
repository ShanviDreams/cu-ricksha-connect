
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth');

// Employee routes
router.post('/employee/signup', authController.employeeSignup);
router.post('/employee/login', authController.employeeLogin);
router.delete('/employee/delete-account', authMiddleware, authController.deleteEmployeeAccount);

// Driver routes
router.post('/driver/signup', authController.driverSignup);
router.post('/driver/login', authController.driverLogin);
router.delete('/driver/delete-account', authMiddleware, authController.deleteDriverAccount);

// Get current user
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;
