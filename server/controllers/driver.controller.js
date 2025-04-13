
const Driver = require('../models/Driver');

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
      isAvailable: driver.isAvailable
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
