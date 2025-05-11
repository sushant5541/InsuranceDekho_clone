const asyncHandler = require('express-async-handler');
const Advisor = require('../models/Advisor');

// @desc    Get all advisors
// @route   GET /api/advisors
// @access  Private/Admin
const getAdvisors = asyncHandler(async (req, res) => {
  const advisors = await Advisor.find({});
  res.json(advisors);
});

// @desc    Create an advisor
// @route   POST /api/advisors
// @access  Private/Admin
const createAdvisor = asyncHandler(async (req, res) => {
  const { name, email, phone, specialization, yearsOfExperience } = req.body;

  const advisorExists = await Advisor.findOne({ email });

  if (advisorExists) {
    res.status(400);
    throw new Error('Advisor already exists');
  }

  const advisor = await Advisor.create({
    name,
    email,
    phone,
    specialization,
    yearsOfExperience,
  });

  if (advisor) {
    res.status(201).json(advisor);
  } else {
    res.status(400);
    throw new Error('Invalid advisor data');
  }
});

// @desc    Get advisor by ID
// @route   GET /api/advisors/:id
// @access  Private/Admin
const getAdvisorById = asyncHandler(async (req, res) => {
  const advisor = await Advisor.findById(req.params.id);

  if (advisor) {
    res.json(advisor);
  } else {
    res.status(404);
    throw new Error('Advisor not found');
  }
});

// @desc    Update advisor
// @route   PUT /api/advisors/:id
// @access  Private/Admin
const updateAdvisor = asyncHandler(async (req, res) => {
  const advisor = await Advisor.findById(req.params.id);

  if (advisor) {
    advisor.name = req.body.name || advisor.name;
    advisor.email = req.body.email || advisor.email;
    advisor.phone = req.body.phone || advisor.phone;
    advisor.specialization = req.body.specialization || advisor.specialization;
    advisor.yearsOfExperience = req.body.yearsOfExperience || advisor.yearsOfExperience;
    advisor.isActive = req.body.isActive !== undefined ? req.body.isActive : advisor.isActive;

    const updatedAdvisor = await advisor.save();

    res.json(updatedAdvisor);
  } else {
    res.status(404);
    throw new Error('Advisor not found');
  }
});

// @desc    Delete advisor
// @route   DELETE /api/advisors/:id
// @access  Private/Admin
const deleteAdvisor = asyncHandler(async (req, res) => {
  const advisor = await Advisor.findById(req.params.id);

  if (advisor) {
    await advisor.remove();
    res.json({ message: 'Advisor removed' });
  } else {
    res.status(404);
    throw new Error('Advisor not found');
  }
});

module.exports = {
  getAdvisors,
  createAdvisor,
  getAdvisorById,
  updateAdvisor,
  deleteAdvisor,
};