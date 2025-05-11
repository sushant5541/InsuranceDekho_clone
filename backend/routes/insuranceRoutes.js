const express = require('express');
const router = express.Router();
const HealthInsurancePlan = require('../models/HealthInsurancePlan');

// @route   POST /api/insurance/get-plans
// @desc    Get health insurance plans based on form data
// @access  Public
router.post('/get-plans', async (req, res) => {
  try {
    const formData = req.body;
    
    // You can add filtering logic based on formData here
    // For now, we'll return all plans
    const plans = await HealthInsurancePlan.find({});
    
    res.json({ 
      success: true,
      plans: plans.map(plan => ({
        _id: plan._id,
        insurerName: plan.insurer,
        planName: plan.planName,
        logo: plan.logo,
        coverAmount: plan.coverAmount,
        cashlessHospitals: plan.cashlessHospitals,
        claimSettled: plan.claimSettled,
        keyFeatures: plan.features,
        premium: parseInt(plan.yearlyPremium.replace(/[^0-9]/g, '')) // Convert "₹30,000" to 30000
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching plans'
    });
  }
});

module.exports = router;