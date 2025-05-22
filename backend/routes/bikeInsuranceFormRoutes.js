const express = require('express');
const BikeInsuranceForm = require('../models/BikeInsuranceForm');
const { protect } = require('../middleware/auth');
const router = express.Router();

// @desc    Create or update bike insurance form (draft)
// @route   POST /api/bike-insurance-form
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { 
      bikeNumber, bikeBrand, bikeModel, bikeType, purchasedYear,
      mobileNumber, insuranceType, bikeValue
    } = req.body;

    // Check for existing draft
    let form = await BikeInsuranceForm.findOne({
      userId: req.user._id,
      status: 'draft'
    });

    if (!form) {
      form = new BikeInsuranceForm({
        userId: req.user._id,
        status: 'draft'
      });
    }

    // Update form data
    form.bikeNumber = bikeNumber;
    form.bikeBrand = bikeBrand;
    form.bikeModel = bikeModel;
    form.bikeType = bikeType;
    form.purchasedYear = purchasedYear;
    form.mobileNumber = mobileNumber;
    form.insuranceType = insuranceType;
    form.bikeValue = bikeValue;

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

router.get('/check', async (req, res) => {
  try {
    const { bikeNumber } = req.query;
    
    // Simulate checking database - in reality you would query your DB
    const hasExistingInsurance = Math.random() > 0.7; // 30% chance of having existing insurance
    
    if (hasExistingInsurance) {
      // Generate random expiry date (between 1 week to 1 year from now)
      const randomDays = Math.floor(Math.random() * (365 - 7 + 1)) + 7;
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + randomDays);
      
      // Generate random policy number
      const policyNumber = 'POL' + Math.floor(100000 + Math.random() * 900000);
      
      return res.json({
        hasActiveInsurance: true,
        expiryDate: expiryDate,
        policyNumber: policyNumber
      });
    }

    res.json({ hasActiveInsurance: false });
  } catch (error) {
    console.error('Error checking bike insurance:', error);
    res.status(500).json({ error: 'Error checking insurance status' });
  }
});
// @desc    Complete bike insurance after payment
// @route   PUT /api/bike-insurance-form/:id/complete
// @access  Private
router.put('/:id/complete', protect, async (req, res) => {
  try {
    const { planId, paymentId, paymentAmount, coverageDetails } = req.body;

    const form = await BikeInsuranceForm.findOne({
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
  return 'BIKE' + 
    Date.now().toString().slice(-6) + 
    Math.floor(1000 + Math.random() * 9000);
}

module.exports = router;