const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/auth');

// @route   POST /api/appointments
// @desc    Book a new appointment
// @access  Public (or Private if you add auth middleware)
router.post('/', async (req, res) => {
  try {
    const { advisorId, name, mobile, gender, address, city, pincode, whatsAppOptIn } = req.body;
    
    const appointment = new Appointment({
      userId: req.user?._id || null,
      advisorId,
      name,
      mobile,
      gender,
      address,
      city,
      pincode,
      whatsAppOptIn
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   GET /api/appointments/my-appointments
// @desc    Get user's appointments
// @access  Private
router.get('/my-appointments', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id })
      .populate('advisorId', 'name specialization profilePhoto');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Make sure this is the last line in the file
module.exports = router;