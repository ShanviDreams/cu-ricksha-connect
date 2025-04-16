
const Employee = require('../models/Employee');
const Driver = require('../models/Driver');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (user, role) => {
  return jwt.sign(
    { id: user.id, role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

exports.employeeSignup = async (req, res) => {
  try {
    const { name, employeeId, password, department, position } = req.body;

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({ employeeId });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee ID already exists' });
    }

    // Create new employee
    const employee = new Employee({
      name,
      employeeId,
      password,
      department,
      position
    });

    // Save employee to database
    await employee.save();

    // Generate token
    const token = generateToken(employee, 'employee');

    res.status(201).json({
      token,
      user: {
        id: employee._id,
        name: employee.name,
        employeeId: employee.employeeId,
        department: employee.department,
        position: employee.position,
        role: 'employee'
      }
    });
  } catch (error) {
    console.error('Employee signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.employeeLogin = async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    // Check if employee exists
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await employee.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(employee, 'employee');

    res.json({
      token,
      user: {
        id: employee._id,
        name: employee.name,
        employeeId: employee.employeeId,
        department: employee.department,
        position: employee.position,
        role: 'employee'
      }
    });
  } catch (error) {
    console.error('Employee login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.driverSignup = async (req, res) => {
  try {
    const { name, mobileNumber, rickshawNumber, location } = req.body;

    // Check if driver already exists
    const existingDriver = await Driver.findOne({ mobileNumber });
    if (existingDriver) {
      return res.status(400).json({ message: 'Mobile number already exists' });
    }

    // Create new driver
    const driver = new Driver({
      name,
      mobileNumber,
      isAvailable: false,
      rickshawNumber,
      location
    });

    // Save driver to database
    await driver.save();

    // Generate token
    const token = generateToken(driver, 'driver');

    res.status(201).json({
      token,
      user: {
        id: driver._id,
        name: driver.name,
        mobileNumber: driver.mobileNumber,
        isAvailable: driver.isAvailable,
        rickshawNumber: driver.rickshawNumber,
        location: driver.location,
        role: 'driver'
      }
    });
  } catch (error) {
    console.error('Driver signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.driverLogin = async (req, res) => {
  try {
    const { name, mobileNumber } = req.body;

    // Check if driver exists
    const driver = await Driver.findOne({ name, mobileNumber });
    if (!driver) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(driver, 'driver');

    res.json({
      token,
      user: {
        id: driver._id,
        name: driver.name,
        mobileNumber: driver.mobileNumber,
        isAvailable: driver.isAvailable,
        rickshawNumber: driver.rickshawNumber,
        location: driver.location,
        role: 'driver'
      }
    });
  } catch (error) {
    console.error('Driver login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const { id, role } = req.user;
    
    if (role === 'employee') {
      const employee = await Employee.findById(id).select('-password');
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      
      return res.json({
        user: {
          id: employee._id,
          name: employee.name,
          employeeId: employee.employeeId,
          department: employee.department,
          position: employee.position,
          role: 'employee'
        }
      });
    } else if (role === 'driver') {
      const driver = await Driver.findById(id);
      if (!driver) {
        return res.status(404).json({ message: 'Driver not found' });
      }
      
      return res.json({
        user: {
          id: driver._id,
          name: driver.name,
          mobileNumber: driver.mobileNumber,
          isAvailable: driver.isAvailable,
          rickshawNumber: driver.rickshawNumber,
          location: driver.location,
          role: 'driver'
        }
      });
    }
    
    return res.status(400).json({ message: 'Invalid user role' });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
