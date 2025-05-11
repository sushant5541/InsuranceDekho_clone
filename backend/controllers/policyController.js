const asyncHandler = require('express-async-handler');
const Policy = require('../models/Policy');

// @desc    Get all policies
// @route   GET /api/policies
// @access  Private/Admin
const getPolicies = asyncHandler(async (req, res) => {
  const policies = await Policy.find({});
  res.json(policies);
});

// @desc    Create a policy
// @route   POST /api/policies
// @access  Private/Admin
const createPolicy = asyncHandler(async (req, res) => {
  const { name, description, coverageAmount, premium, duration, policyType } = req.body;

  const policy = await Policy.create({
    name,
    description,
    coverageAmount,
    premium,
    duration,
    policyType,
  });

  if (policy) {
    res.status(201).json(policy);
  } else {
    res.status(400);
    throw new Error('Invalid policy data');
  }
});

// @desc    Get policy by ID
// @route   GET /api/policies/:id
// @access  Private/Admin
const getPolicyById = asyncHandler(async (req, res) => {
  const policy = await Policy.findById(req.params.id);

  if (policy) {
    res.json(policy);
  } else {
    res.status(404);
    throw new Error('Policy not found');
  }
});

// @desc    Update policy
// @route   PUT /api/policies/:id
// @access  Private/Admin
const updatePolicy = asyncHandler(async (req, res) => {
  const policy = await Policy.findById(req.params.id);

  if (policy) {
    policy.name = req.body.name || policy.name;
    policy.description = req.body.description || policy.description;
    policy.coverageAmount = req.body.coverageAmount || policy.coverageAmount;
    policy.premium = req.body.premium || policy.premium;
    policy.duration = req.body.duration || policy.duration;
    policy.policyType = req.body.policyType || policy.policyType;
    policy.isActive = req.body.isActive !== undefined ? req.body.isActive : policy.isActive;

    const updatedPolicy = await policy.save();

    res.json(updatedPolicy);
  } else {
    res.status(404);
    throw new Error('Policy not found');
  }
});

// @desc    Delete policy
// @route   DELETE /api/policies/:id
// @access  Private/Admin
const deletePolicy = asyncHandler(async (req, res) => {
  const policy = await Policy.findById(req.params.id);

  if (policy) {
    await policy.remove();
    res.json({ message: 'Policy removed' });
  } else {
    res.status(404);
    throw new Error('Policy not found');
  }
});

module.exports = {
  getPolicies,
  createPolicy,
  getPolicyById,
  updatePolicy,
  deletePolicy,
};