const Advisor = require('../models/Advisor');

// @desc    Get all advisors (public)
// @route   GET /api/advisors
// @access  Public
const getAdvisors = async (req, res) => {
  try {
    // For public access, only show active advisors
    // For admin access, show all advisors
    const isAdminRequest = req.user?.isAdmin;
    let query = isAdminRequest ? {} : { isActive: true };

    const { city, specialization } = req.query;
    
    if (city) query.City = { $regex: new RegExp(city, 'i') };
    if (specialization) query.specialization = { $regex: new RegExp(specialization, 'i') };

    const advisors = await Advisor.find(query).sort({ yearsOfExperience: -1 });
    
    if (!advisors || advisors.length === 0) {
      return res.status(200).json([]); // Return empty array if no advisors found
    }

    res.status(200).json(advisors);
  } catch (error) {
    console.error('Get advisors error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching advisors',
      error: error.message 
    });
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
      name,
      email,
      phone,
      specialization,
      City,
      yearsOfExperience,
      profilePhoto: req.body.profilePhoto || 'https://randomuser.me/api/portraits/lego/1.jpg',
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
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

    const { name, email, phone, specialization, City, yearsOfExperience, profilePhoto, isActive } = req.body;

    advisor.name = name || advisor.name;
    advisor.email = email || advisor.email;
    advisor.phone = phone || advisor.phone;
    advisor.specialization = specialization || advisor.specialization;
    advisor.City = City || advisor.City;
    advisor.yearsOfExperience = yearsOfExperience || advisor.yearsOfExperience;
    advisor.profilePhoto = profilePhoto || advisor.profilePhoto;
    advisor.isActive = isActive !== undefined ? isActive : advisor.isActive;

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