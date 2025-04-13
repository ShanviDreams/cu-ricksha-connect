
const Teacher = require('../models/Teacher');
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

exports.teacherSignup = async (req, res) => {
  try {
    const { name, employeeId, password } = req.body;

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ employeeId });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Employee ID already exists' });
    }

    // Create new teacher
    const teacher = new Teacher({
      name,
      employeeId,
      password
    });

    // Save teacher to database
    await teacher.save();

    // Generate token
    const token = generateToken(teacher, 'teacher');

    res.status(201).json({
      token,
      user: {
        id: teacher._id,
        name: teacher.name,
        employeeId: teacher.employeeId,
        role: 'teacher'
      }
    });
  } catch (error) {
    console.error('Teacher signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.teacherLogin = async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    // Check if teacher exists
    const teacher = await Teacher.findOne({ employeeId });
    if (!teacher) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await teacher.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(teacher, 'teacher');

    res.json({
      token,
      user: {
        id: teacher._id,
        name: teacher.name,
        employeeId: teacher.employeeId,
        role: 'teacher'
      }
    });
  } catch (error) {
    console.error('Teacher login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.driverSignup = async (req, res) => {
  try {
    const { name, mobileNumber } = req.body;

    // Check if driver already exists
    const existingDriver = await Driver.findOne({ mobileNumber });
    if (existingDriver) {
      return res.status(400).json({ message: 'Mobile number already exists' });
    }

    // Create new driver
    const driver = new Driver({
      name,
      mobileNumber,
      isAvailable: false
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
        role: 'driver'
      }
    });
  } catch (error) {
    console.error('Driver login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
