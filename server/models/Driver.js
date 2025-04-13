
const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  isAvailable: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
