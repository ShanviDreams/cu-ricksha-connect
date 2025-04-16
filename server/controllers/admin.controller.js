
const Employee = require('../models/Employee');
const Driver = require('../models/Driver');
const Booking = require('../models/Booking');

exports.clearDatabase = async (req, res) => {
  try {
    // Delete all employees
    await Employee.deleteMany({});
    
    // Delete all drivers
    await Driver.deleteMany({});
    
    // Delete all bookings
    await Booking.deleteMany({});
    
    res.json({ message: 'All data has been cleared successfully' });
  } catch (error) {
    console.error('Clear database error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.clearEmployees = async (req, res) => {
  try {
    // Delete all employees
    await Employee.deleteMany({});
    
    res.json({ message: 'All employees have been cleared successfully' });
  } catch (error) {
    console.error('Clear employees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.clearDrivers = async (req, res) => {
  try {
    // Delete all drivers
    await Driver.deleteMany({});
    
    res.json({ message: 'All drivers have been cleared successfully' });
  } catch (error) {
    console.error('Clear drivers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
