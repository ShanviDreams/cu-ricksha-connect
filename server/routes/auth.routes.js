
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Teacher routes
router.post('/teacher/signup', authController.teacherSignup);
router.post('/teacher/login', authController.teacherLogin);

// Driver routes
router.post('/driver/signup', authController.driverSignup);
router.post('/driver/login', authController.driverLogin);

module.exports = router;
