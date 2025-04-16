
const Booking = require('../models/Booking');
const Driver = require('../models/Driver');

exports.createBooking = async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation, pickupTime, message } = req.body;
    const { id } = req.user;
    
    // Create new booking
    const booking = new Booking({
      employee: id,
      pickupLocation,
      dropoffLocation,
      pickupTime: new Date(pickupTime),
      status: 'pending',
      message
    });
    
    // Save booking to database
    await booking.save();
    
    // Populate employee information
    await booking.populate('employee', 'name employeeId');
    
    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    // For employees, only show their own bookings
    // For drivers, show all bookings that are pending or they're assigned to
    const { id, role } = req.user;
    
    let query = {};
    
    if (role === 'employee') {
      query.employee = id;
    } else if (role === 'driver') {
      // Drivers see all pending bookings + bookings assigned to them
      query = {
        $or: [
          { status: 'pending' },
          { assignedDriver: id }
        ]
      };
    }
    
    const bookings = await Booking.find(query)
      .populate('employee', 'name employeeId')
      .populate('assignedDriver', 'name mobileNumber')
      .populate('driverResponses.driver', 'name mobileNumber')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findById(id)
      .populate('employee', 'name employeeId')
      .populate('assignedDriver', 'name mobileNumber')
      .populate('driverResponses.driver', 'name mobileNumber');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user has permission to view this booking
    const { id: userId, role } = req.user;
    
    if (
      role === 'employee' && booking.employee._id.toString() !== userId ||
      role === 'driver' && 
      booking.status !== 'pending' && 
      booking.assignedDriver?._id.toString() !== userId
    ) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    
    if (!['pending', 'accepted', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Employees can cancel their own bookings
    // Drivers can update status if they are assigned
    if (
      (req.user.role === 'employee' && 
       booking.employee.toString() === userId && 
       status === 'rejected') ||
      (req.user.role === 'driver' && 
       booking.assignedDriver?.toString() === userId)
    ) {
      booking.status = status;
      
      if (status === 'rejected') {
        booking.assignedDriver = null;
      }
      
      await booking.save();
      await booking.populate('employee', 'name employeeId');
      await booking.populate('assignedDriver', 'name mobileNumber');
      await booking.populate('driverResponses.driver', 'name mobileNumber');
      
      return res.json(booking);
    }
    
    res.status(403).json({ message: 'Not authorized to update this booking' });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
