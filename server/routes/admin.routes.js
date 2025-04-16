
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// Clear entire database
router.post('/clear-all', adminController.clearDatabase);

// Clear all employees
router.post('/clear-employees', adminController.clearEmployees);

// Clear all drivers
router.post('/clear-drivers', adminController.clearDrivers);

module.exports = router;
