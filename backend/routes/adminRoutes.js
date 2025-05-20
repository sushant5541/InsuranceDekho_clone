const express = require('express');
const router = express.Router();
const { authAdmin } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/adminMiddleware');
const User = require('../models/User');
const Policy = require('../models/Policy');
const Payment = require('../models/Payment');
const BikeInsurancePlan = require('../models/BikeInsurancePlan');
const CarInsurancePlan = require('../models/CarInsurancePlan');
const HealthInsurancePlan = require('../models/HealthInsurancePlan');


// Public route
router.post('/login', authAdmin);

// Protected routes
router.get('/profile', protect, admin, (req, res) => {
  res.json(req.admin);
});

// Get users with their policies
router.get('/users-with-policies', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    const usersWithPolicies = await Promise.all(
      users.map(async (user) => {
        const payments = await Payment.find({ user: user._id, status: 'captured' })
          .sort({ createdAt: -1 });

        // Process payments with plan names
        const paymentsWithPlanNames = await Promise.all(
          payments.map(async (payment) => {
            let planName = 'Unknown Plan';
            
            try {
              switch (payment.planType) {
                case 'bike':
                  const bikePlan = await BikeInsurancePlan.findById(payment.plan).select('plan');
                  if (bikePlan) planName = bikePlan.plan;
                  break;
                case 'car':
                  const carPlan = await CarInsurancePlan.findById(payment.plan).select('plan');
                  if (carPlan) planName = carPlan.plan;
                  break;
                case 'health':
                  const healthPlan = await HealthInsurancePlan.findById(payment.plan).select('plan');
                  if (healthPlan) planName = healthPlan.plan;
                  break;
                case 'life':
                  const lifePlan = await LifeInsurancePlan.findById(payment.plan).select('plan');
                  if (lifePlan) planName = lifePlan.plan;
                  break;
              }
            } catch (err) {
              console.error(`Error fetching plan for payment ${payment._id}:`, err);
            }

            return {
              ...payment.toObject(),
              plan: { plan: planName }  // Changed to use 'plan' instead of 'policyName'
            };
          })
        );

        const totalPremium = paymentsWithPlanNames.reduce((sum, payment) => sum + (payment.amount / 100), 0);
        
        return {
          ...user.toObject(),
          payments: paymentsWithPlanNames,
          totalPremium
        };
      })
    );
    
    res.json(usersWithPolicies);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



module.exports = router;