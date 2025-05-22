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

    // Find active policies (not expired or cancelled)
    const existingPolicy = await CarInsuranceForm.findOne({
      carNumber: carNumber.toUpperCase(),
      status: { $in: ['completed', 'pending_payment'] },
      policyEndDate: { $gt: new Date() }
    });

    if (existingPolicy) {
      return res.status(200).json({
        success: true,
        hasInsurance: true,
        policy: {
          policyNumber: existingPolicy.policyNumber,
          insurer: existingPolicy.planId?.name || 'Unknown',
          expiryDate: existingPolicy.policyEndDate
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


router.post('/', protect, async (req, res) => {
  try {
    const { 
      carNumber, carBrand, carModel, carType, purchasedYear,
      mobileNumber, insuranceType, carValue
    } = req.body;

    // Check for existing draft
    let form = await CarInsuranceForm.findOne({
      userId: req.user._id,
      status: 'draft'
    });

    if (!form) {
      form = new CarInsuranceForm({
        userId: req.user._id,
        status: 'draft'
      });
    }

    // Update form data
    form.carNumber = carNumber;
    form.carBrand = carBrand;
    form.carModel = carModel;
    form.carType = carType;
    form.purchasedYear = purchasedYear;
    form.mobileNumber = mobileNumber;
    form.insuranceType = insuranceType;
    form.carValue = carValue;

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