
require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const Driver = require('../models/Driver');
const Booking = require('../models/Booking');

const clearDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');
    
    // Delete all employees
    const deletedEmployees = await Employee.deleteMany({});
    console.log(`Deleted ${deletedEmployees.deletedCount} employees.`);
    
    // Delete all drivers
    const deletedDrivers = await Driver.deleteMany({});
    console.log(`Deleted ${deletedDrivers.deletedCount} drivers.`);
    
    // Delete all bookings
    const deletedBookings = await Booking.deleteMany({});
    console.log(`Deleted ${deletedBookings.deletedCount} bookings.`);
    
    console.log('All data has been cleared successfully.');
  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
};

clearDatabase();
