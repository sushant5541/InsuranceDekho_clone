const express = require('express');
const router = express.Router();
const CarInsurancePlan = require('../models/CarInsurancePlan');

// @route   GET /api/car-insurance/plans
// @desc    Get car insurance plans based on type with limit
// @access  Public
router.get('/plans', async (req, res) => {
  try {
    const { type } = req.query;
    
    let query = {};
    if (type) {
      query.planType = new RegExp(`^${type}$`, 'i'); // Match "Comprehensive", "comprehensive", etc.

    }
    
    // Set limits based on plan type
    let limit;
    if (type === 'Comprehensive') {
      limit = 3; // Show 3 comprehensive plans
    } else if (type === 'Third Party') {
      limit = 2; // Show 2 third party plans
    } else if (type === 'Own Damage') {
      limit = 2; // Show 2 own damage plans
    } else {
      limit = 0; // Return all if no type specified
    }
    
    const plans = limit > 0 
      ? await CarInsurancePlan.find(query).limit(limit)
      : await CarInsurancePlan.find(query);
    
    res.json({ 
      success: true,
      plans: plans.map(plan => ({
        _id: plan._id,
        id: plan._id, // Include both _id and id for compatibility
        name: `${plan.insurer} ${plan.planName}`,
        logo: plan.logo,
        features: plan.features,
        price: plan.price,
        keyFeatures: plan.keyFeatures,
        planType: plan.planType,
        discount: plan.discount,
        coverageAmount: plan.coverageAmount, // Additional car-specific field
        cashlessGarages: plan.cashlessGarages // Additional car-specific field
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching car insurance plans'
    });
  }
});

// Keep the existing routes for backward compatibility
router.get('/', async (req, res) => {
  try {
    const plans = await CarInsurancePlan.find();
    res.json({ success: true, plans });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:type', async (req, res) => {
  try {
    const plans = await CarInsurancePlan.find({ planType: req.params.type });
    if (!plans.length) {
      return res.status(404).json({ success: false, error: 'No plans found for this type' });
    }
    res.json({ success: true, plans });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const plan = new CarInsurancePlan(req.body);
    await plan.save();
    res.status(201).json({ success: true, plan });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Add a new car insurance plan (Admin-only in production)
router.post('/', async (req, res) => {
  try {
    const plan = new CarInsurancePlan(req.body);
    await plan.save();
    res.status(201).json({ success: true, plan });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;