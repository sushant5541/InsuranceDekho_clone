const express = require('express');
const CarInsuranceForm = require('../models/CarInsurnaceForm');
const { protect } = require('../middleware/auth');
const router = express.Router();

// @desc    Create or update car insurance form (draft)
// @route   POST /api/car-insurance-form
// @access  Private


router.get('/check', async (req, res) => {
  try {
    const { carNumber } = req.query;
    
    if (!carNumber) {
      return res.status(400).json({
        success: false,
        error: 'Car number is required'
      });
    }

    // Find active policies
    const existingPolicy = await CarInsuranceForm.findOne({
      carNumber: carNumber.toUpperCase(),
      status: { $in: ['completed', 'pending_payment'] },
      policyEndDate: { $gt: new Date() }
    }).populate('planId', 'name price');

    if (existingPolicy) {
      return res.status(200).json({
        success: true,
        hasInsurance: true,
        policy: {
          policyNumber: existingPolicy.policyNumber,
          insurer: existingPolicy.planId?.name || 'Unknown',
          expiryDate: existingPolicy.policyEndDate,
          planPrice: existingPolicy.planId?.price
        }
      });
    }

    res.status(200).json({
      success: true,
      hasInsurance: false
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});


router.post('/create', protect, async (req, res) => {
  try {
    // First check for existing active insurance
    const existing = await CarInsuranceForm.checkExistingInsurance(
      req.body.carNumber, 
      req.user._id
    );
    
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Active insurance already exists for this vehicle',
        existingPolicy: existing
      });
    }

    // Create new record
    const formData = {
      ...req.body,
      userId: req.user._id,
      status: 'completed',
      policyNumber: generatePolicyNumber(),
      policyStartDate: new Date(),
      policyEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      paymentDate: new Date()
    };

    const form = new CarInsuranceForm(formData);
    await form.save();

    res.status(201).json({ success: true, data: form });
  } catch (error) {
    console.error('Create error:', error);
    res.status(400).json({
      success: false,
      error: error.message,
      validationErrors: error.errors
    });
  }
});
// @desc    Complete car insurance after payment
// @route   PUT /api/car-insurance-form/:id/complete
// @access  Private
router.put('/:id/complete', protect, async (req, res) => {
  try {
    const { planId, paymentId, paymentAmount, coverageDetails } = req.body;

    const form = await CarInsuranceForm.findOne({
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

    form.planId = planId;
    form.paymentId = paymentId;
    form.paymentAmount = paymentAmount;
    form.coverageDetails = coverageDetails;
    form.status = 'completed';
    form.policyNumber = generatePolicyNumber(); // Implement this function
    form.policyStartDate = new Date();
    form.policyEndDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    form.paymentDate = new Date();

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

// Helper function to generate policy number
function generatePolicyNumber() {
  return 'CAR' + 
    Date.now().toString().slice(-6) + 
    Math.floor(1000 + Math.random() * 9000);
}

module.exports = router;