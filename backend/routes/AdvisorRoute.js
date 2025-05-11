const express = require('express');
const router = express.Router();
const Advisor = require('../models/Advisor');
const { protect, admin } = require('../middleware/auth');

// @desc    Get all advisors
// @route   GET /api/advisors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { city, specialization } = req.query;
    let query = {};

    if (city) query.City = { $regex: new RegExp(city, 'i') };
    if (specialization) query.specialization = { $regex: new RegExp(specialization, 'i') };

    const advisors = await Advisor.find(query).sort({ yearsOfExperience: -1 });
    res.json(advisors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create new advisor
// @route   POST /api/advisors
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, email, phone, specialization, City, yearsOfExperience } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !specialization || !City || !yearsOfExperience) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Check if advisor already exists
    const advisorExists = await Advisor.findOne({ email });
    if (advisorExists) {
      return res.status(400).json({ message: 'Advisor already exists' });
    }

    const advisor = new Advisor({
      name,
      email,
      phone,
      specialization,
      City,
      yearsOfExperience,
      profilePhoto: req.body.profilePhoto || 'https://randomuser.me/api/portraits/lego/1.jpg'
    });

    const newAdvisor = await advisor.save();
    res.status(201).json(newAdvisor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update advisor
// @route   PUT /api/advisors/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const advisor = await Advisor.findById(req.params.id);
    if (!advisor) {
      return res.status(404).json({ message: 'Advisor not found' });
    }

    advisor.name = req.body.name || advisor.name;
    advisor.email = req.body.email || advisor.email;
    advisor.phone = req.body.phone || advisor.phone;
    advisor.specialization = req.body.specialization || advisor.specialization;
    advisor.City = req.body.City || advisor.City;
    advisor.yearsOfExperience = req.body.yearsOfExperience || advisor.yearsOfExperience;
    advisor.profilePhoto = req.body.profilePhoto || advisor.profilePhoto;
    advisor.isActive = req.body.isActive !== undefined ? req.body.isActive : advisor.isActive;

    const updatedAdvisor = await advisor.save();
    res.json(updatedAdvisor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Delete advisor
// @route   DELETE /api/advisors/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    console.log('User making request:', req.user); // Debug log
    
    const advisor = await Advisor.findById(req.params.id);
    if (!advisor) {
      return res.status(404).json({ message: 'Advisor not found' });
    }

    await advisor.remove();
    res.json({ message: 'Advisor removed successfully' });
  } catch (err) {
    console.error('Server error during delete:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;