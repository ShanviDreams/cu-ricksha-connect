
const Driver = require('../models/Driver');
const Booking = require('../models/Booking');

exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().select('-__v -createdAt -updatedAt');
    
    res.json(drivers);
  } catch (error) {
    console.error('Get drivers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const { id } = req.user;

    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({ message: 'Availability status must be a boolean' });
    }

    // Update driver availability
    const driver = await Driver.findByIdAndUpdate(
      id,
      { isAvailable },
      { new: true }
    ).select('-__v -createdAt -updatedAt');

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Send back updated driver data
    res.json({
      id: driver._id,
      name: driver.name,
      mobileNumber: driver.mobileNumber,
      isAvailable: driver.isAvailable,
      rickshawNumber: driver.rickshawNumber,
      location: driver.location
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.respondToBooking = async (req, res) => {
  try {
    const { bookingId, response } = req.body;
    const { id } = req.user;
    
    if (!['green', 'orange'].includes(response)) {
      return res.status(400).json({ message: 'Response must be either "green" or "orange"' });
    }
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if driver has already responded
    const existingResponseIndex = booking.driverResponses.findIndex(
      dr => dr.driver.toString() === id
    );
    
    if (existingResponseIndex !== -1) {
      // Update existing response
      booking.driverResponses[existingResponseIndex].response = response;
      booking.driverResponses[existingResponseIndex].respondedAt = Date.now();
    } else {
      // Add new response
      booking.driverResponses.push({
        driver: id,
        response,
        respondedAt: Date.now()
      });
    }
    
    // If response is green and no driver assigned yet, assign this driver
    if (response === 'green' && !booking.assignedDriver) {
      booking.assignedDriver = id;
      booking.status = 'accepted';
    }
    
    await booking.save();
    
    // Populate driver information
    await booking.populate('driverResponses.driver', 'name mobileNumber');
    await booking.populate('assignedDriver', 'name mobileNumber');
    await booking.populate('employee', 'name employeeId');
    
    res.json(booking);
  } catch (error) {
    console.error('Respond to booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDriverBookings = async (req, res) => {
  try {
    const { id } = req.user;
    
    // Find bookings where this driver is assigned or has responded
    const bookings = await Booking.find({
      $or: [
        { assignedDriver: id },
        { 'driverResponses.driver': id }
      ]
    })
    .populate('employee', 'name employeeId')
    .populate('assignedDriver', 'name mobileNumber')
    .populate('driverResponses.driver', 'name mobileNumber')
    .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Get driver bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
