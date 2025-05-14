const Advisor = require('../models/Advisor');

// @desc    Get all advisors
// @route   GET /api/advisors
// @access  Public
const getAdvisors = async (req, res) => {
  try {
    const { city, specialization } = req.query;
    let query = { isActive: true };

    if (city) query.City = { $regex: new RegExp(city, 'i') };
    if (specialization) query.specialization = { $regex: new RegExp(specialization, 'i') };

    const advisors = await Advisor.find(query).sort({ yearsOfExperience: -1 });
    res.json(advisors);
  } catch (error) {
    console.error('Get advisors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new advisor
// @route   POST /api/advisors
// @access  Private/Admin
const createAdvisor = async (req, res) => {
  try {
    const { name, email, phone, specialization, City, yearsOfExperience } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !specialization || !City || !yearsOfExperience) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if advisor exists
    const advisorExists = await Advisor.findOne({ email });
    if (advisorExists) {
      return res.status(400).json({ message: 'Advisor already exists' });
    }

    const advisor = await Advisor.create({
      ...req.body,
      profilePhoto: req.body.profilePhoto || 'https://randomuser.me/api/portraits/lego/1.jpg',
      userId: req.user._id
    });

    res.status(201).json(advisor);
  } catch (error) {
    console.error('Create advisor error:', error);
    res.status(400).json({ 
      message: 'Advisor creation failed',
      error: error.message
    });
  }
};

// @desc    Update advisor
// @route   PUT /api/advisors/:id
// @access  Private/Admin
const updateAdvisor = async (req, res) => {
  try {
    const advisor = await Advisor.findById(req.params.id);
    if (!advisor) {
      return res.status(404).json({ message: 'Advisor not found' });
    }

    // Update fields
    const updates = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      specialization: req.body.specialization,
      City: req.body.City,
      yearsOfExperience: req.body.yearsOfExperience,
      profilePhoto: req.body.profilePhoto || advisor.profilePhoto,
      isActive: req.body.isActive
    };

    Object.assign(advisor, updates);
    const updatedAdvisor = await advisor.save();
    res.json(updatedAdvisor);
  } catch (error) {
    console.error('Update advisor error:', error);
    res.status(400).json({ 
      message: 'Advisor update failed',
      error: error.message
    });
  }
};

// @desc    Delete advisor
// @route   DELETE /api/advisors/:id
// @access  Private/Admin
const deleteAdvisor = async (req, res) => {
  try {
    const advisor = await Advisor.findById(req.params.id);
    if (!advisor) {
      return res.status(404).json({ message: 'Advisor not found' });
    }

    await advisor.deleteOne();
    res.json({ message: 'Advisor removed successfully' });
  } catch (error) {
    console.error('Delete advisor error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single advisor by ID
// @route   GET /api/advisors/:id
// @access  Private/Admin
const getAdvisorById = async (req, res) => {
  try {
    const advisor = await Advisor.findById(req.params.id);
    
    if (!advisor) {
      return res.status(404).json({ message: 'Advisor not found' });
    }
    
    res.json(advisor);
  } catch (error) {
    console.error('Get advisor by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAdvisors,
  getAdvisorById,
  createAdvisor,
  updateAdvisor,
  deleteAdvisor
};