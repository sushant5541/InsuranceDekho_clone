const express = require('express');
const HealthInsuranceForm = require('../models/HealthInsuranceForm');
const { protect } = require('../middleware/auth');
const router = express.Router();

// @desc    Create or update health insurance form (draft)
// @route   POST /api/health-insurance-form
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { 
      name, mobile, gender, address, city, pincode, whatsAppOptIn,
      members, planId
    } = req.body;

    // Check for existing draft
    let form = await HealthInsuranceForm.findOne({
      userId: req.user._id,
      status: 'draft'
    });

    if (!form) {
      form = new HealthInsuranceForm({
        userId: req.user._id,
        status: 'draft'
      });
    }

    // Update form data
    form.name = name;
    form.mobile = mobile;
    form.gender = gender;
    form.address = address;
    form.city = city;
    form.pincode = pincode;
    form.whatsAppOptIn = whatsAppOptIn !== false;
    form.members = members;
    form.planId = planId;

    await form.save();

    res.status(200).json({
      success: true,
      data: form
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Complete health insurance after payment
// @route   PUT /api/health-insurance-form/:id/complete
// @access  Private
router.put('/:id/complete', protect, async (req, res) => {
  try {
    const { paymentId, paymentAmount, coverageDetails } = req.body;

    const form = await HealthInsuranceForm.findOne({
      _id: req.params.id,
      userId: req.user._id,
      status: { $in: ['draft', 'pending_payment'] }
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        error: 'Form not found or already completed'
      });
    }

    // Update payment and policy details
    form.paymentId = paymentId;
    form.paymentAmount = paymentAmount;
    form.coverageDetails = coverageDetails;
    form.status = 'completed';
    form.policyStartDate = new Date();
    form.policyEndDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    form.paymentDate = new Date();

    await form.save();

    // Here you might want to trigger any post-payment actions:
    // - Send confirmation email
    // - Generate policy document
    // - Notify customer support

    res.status(200).json({
      success: true,
      data: form
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

router.put('/:id/submit', protect, async (req, res) => {
  try {
    const { 
      name, mobile, gender, address, city, pincode, 
      whatsAppOptIn, members, planId 
    } = req.body;

    let form = await HealthInsuranceForm.findOne({
      _id: req.params.id,
      userId: req.user._id,
      status: 'draft'
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        error: 'Form not found'
      });
    }

    // Update all form data
    form.name = name;
    form.mobile = mobile;
    form.gender = gender;
    form.address = address;
    form.city = city;
    form.pincode = pincode;
    form.whatsAppOptIn = whatsAppOptIn !== false;
    form.members = members;
    form.planId = planId;
    form.status = 'pending_payment'; // Mark as ready for payment
    
    await form.save();

    res.status(200).json({
      success: true,
      data: form
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});
// @desc    Get user's health insurance forms
// @route   GET /api/health-insurance-form
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const forms = await HealthInsuranceForm.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('planId', 'name coverageAmount price');

    res.status(200).json({
      success: true,
      data: forms
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Cancel health insurance policy
// @route   PUT /api/health-insurance-form/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const { reason } = req.body;

    const form = await HealthInsuranceForm.findOne({
      _id: req.params.id,
      userId: req.user._id,
      status: { $in: ['completed', 'pending_payment'] }
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        error: 'Form not found or already cancelled'
      });
    }

    form.status = 'cancelled';
    form.rejectionReason = reason;
    await form.save();

    res.status(200).json({
      success: true,
      data: form
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;