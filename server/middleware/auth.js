
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');
const Driver = require('../models/Driver');

const authMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user from payload
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user is an employee
const isEmployee = async (req, res, next) => {
  try {
    if (req.user.role !== 'employee') {
      return res.status(403).json({ message: 'Access denied. Employee access required.' });
    }
    
    const employee = await Employee.findById(req.user.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    next();
  } catch (error) {
    console.error('Employee authorization error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to check if user is a driver
const isDriver = async (req, res, next) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ message: 'Access denied. Driver access required.' });
    }
    
    const driver = await Driver.findById(req.user.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    
    next();
  } catch (error) {
    console.error('Driver authorization error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  authMiddleware,
  isEmployee,
  isDriver
};
