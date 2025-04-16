
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  pickupLocation: {
    type: String,
    required: true,
    trim: true
  },
  dropoffLocation: {
    type: String,
    required: true,
    trim: true
  },
  pickupTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null
  },
  driverResponses: [{
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver'
    },
    response: {
      type: String,
      enum: ['green', 'orange'],
      required: true
    },
    respondedAt: {
      type: Date,
      default: Date.now
    }
  }],
  message: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
