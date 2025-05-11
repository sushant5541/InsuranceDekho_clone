const express = require('express');
const router = express.Router();
const Policy = require('../models/Policy');
const { protect, admin } = require('../middleware/auth');

// @desc    Get all policies
// @route   GET /api/policies
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    let query = {};

    if (type) query.policyType = { $regex: new RegExp(type, 'i') };

    const policies = await Policy.find(query).sort({ coverageAmount: -1 });
    res.json(policies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Create new policy
// @route   POST /api/policies
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const policy = new Policy({
      name: req.body.name,
      description: req.body.description,
      coverageAmount: req.body.coverageAmount,
      premium: req.body.premium,
      duration: req.body.duration,
      policyType: req.body.policyType
    });

    const newPolicy = await policy.save();
    res.status(201).json(newPolicy);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Update policy
// @route   PUT /api/policies/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    policy.name = req.body.name || policy.name;
    policy.description = req.body.description || policy.description;
    policy.coverageAmount = req.body.coverageAmount || policy.coverageAmount;
    policy.premium = req.body.premium || policy.premium;
    policy.duration = req.body.duration || policy.duration;
    policy.policyType = req.body.policyType || policy.policyType;
    policy.isActive = req.body.isActive !== undefined ? req.body.isActive : policy.isActive;

    const updatedPolicy = await policy.save();
    res.json(updatedPolicy);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Delete policy
// @route   DELETE /api/policies/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    await policy.remove();
    res.json({ message: 'Policy removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;