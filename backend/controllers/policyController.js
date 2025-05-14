const Policy = require('../models/Policy');

// @desc    Get all policies
// @route   GET /api/policies
// @access  Private/Admin
const getPolicies = async (req, res) => {
  try {
    const policies = await Policy.find({});
    res.json(policies);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a policy
// @route   POST /api/policies
// @access  Private/Admin
const createPolicy = async (req, res) => {
  try {
    const { name, description, coverageAmount, premium, duration, policyType } = req.body;

    // Validate required fields
    if (!name || !description || !coverageAmount || !premium || !duration || !policyType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const policy = new Policy({
      name,
      description,
      coverageAmount: Number(coverageAmount),
      premium: Number(premium),
      duration: Number(duration),
      policyType,
      userId: req.user._id,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    });

    const savedPolicy = await policy.save();
    res.status(201).json(savedPolicy);
  } catch (error) {
    res.status(400).json({ 
      message: 'Policy creation failed',
      error: error.message
    });
  }
};

// @desc    Update a policy
// @route   PUT /api/policies/:id
// @access  Private/Admin
const updatePolicy = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    const updates = {
      name: req.body.name,
      description: req.body.description,
      coverageAmount: req.body.coverageAmount,
      premium: req.body.premium,
      duration: req.body.duration,
      policyType: req.body.policyType,
      isActive: req.body.isActive
    };

    Object.assign(policy, updates);
    const updatedPolicy = await policy.save();
    res.json(updatedPolicy);
  } catch (error) {
    res.status(400).json({ 
      message: 'Policy update failed',
      error: error.message
    });
  }
};

// @desc    Get policy by ID
// @route   GET /api/policies/:id
// @access  Private/Admin
const getPolicyById = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }
    res.json(policy);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete policy
// @route   DELETE /api/policies/:id
// @access  Private/Admin
const deletePolicy = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    await policy.deleteOne();
    res.json({ message: 'Policy removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPolicies,
  createPolicy,
  getPolicyById,
  updatePolicy,
  deletePolicy,
};