// backend/routes/bikeInsuranceRoutes.js
const express = require('express');
const router = express.Router();
const BikeInsurancePlan = require('../models/BikeInsurancePlan');

// @route   GET /api/bike-insurance/plans
// @desc    Get bike insurance plans based on type with limit
// @access  Public
router.get('/plans', async (req, res) => {
  try {
    const { type } = req.query;
    
    let query = {};
    if (type) {
      query.planType = type;
    }
    
    // Set limits based on plan type
    let limit;
    if (type === 'Comprehensive') {
      limit = 2;
    } else if (type === 'Third Party') {
      limit = 2;
    } else if (type === 'Own Damage') {
      limit = 1;
    } else {
      limit = 0; // Return all if no type specified
    }
    
    const plans = await BikeInsurancePlan.find(query).limit(limit);
    
    res.json({ 
      success: true,
      plans: plans.map(plan => ({
        _id: plan._id, // Make sure to include the _id field
        id: plan._id, // Include both _id and id for compatibility
        name: `${plan.insurer} ${plan.planName}`,
        logo: plan.logo,
        features: plan.features,
        price: plan.price,
        keyFeatures: plan.keyFeatures,
        planType: plan.planType,
        discount: plan.discount
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching bike insurance plans'
    });
  }
});

module.exports = router;