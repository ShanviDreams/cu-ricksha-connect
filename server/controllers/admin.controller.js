
const Employee = require('../models/Employee');
const Driver = require('../models/Driver');
const Booking = require('../models/Booking');
const Admin = require('../models/Admin');

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select('-password');
    res.json(employees);
  } catch (error) {
    console.error('Get all employees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all drivers
exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().select('-password');
    res.json(drivers);
  } catch (error) {
    console.error('Get all drivers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete all employees
exports.deleteAllEmployees = async (req, res) => {
  try {
    const result = await Employee.deleteMany({});
    res.json({ message: `${result.deletedCount} employees deleted` });
  } catch (error) {
    console.error('Delete all employees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete all drivers
exports.deleteAllDrivers = async (req, res) => {
  try {
    const result = await Driver.deleteMany({});
    res.json({ message: `${result.deletedCount} drivers deleted` });
  } catch (error) {
    console.error('Delete all drivers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete all bookings
exports.deleteAllBookings = async (req, res) => {
  try {
    const result = await Booking.deleteMany({});
    res.json({ message: `${result.deletedCount} bookings deleted` });
  } catch (error) {
    console.error('Delete all bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create admin account
exports.createAdmin = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Please provide username, password, and email' });
    }
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists with that username or email' });
    }
    
    // Create new admin
    const admin = new Admin({
      username,
      password,
      email
    });
    
    await admin.save();
    
    res.status(201).json({
      message: 'Admin account created successfully',
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
