const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, profile, updateProfile } = require('../controllers/authController');
const bcrypt = require('bcryptjs');
const { protect, admin } = require('../middleware/auth');
const User = require('../models/User'); 
const Payment = require('../models/Payment');
const BikeInsurancePlan = require('../models/BikeInsurancePlan');
const CarInsurancePlan = require('../models/CarInsurancePlan');
const HealthInsurancePlan = require('../models/HealthInsurancePlan');

router.post('/register', register);
router.post('/login', login);
router.route('/profile')
  .get(protect, profile)          // GET /api/auth/profile
  .put(protect, updateProfile);  


 // For non-logged in users
router.put('/forgot-password', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') } 
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();
    
    res.json({ 
      success: true,
      message: 'Password updated successfully' 
    });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ 
      message: 'Server error during password reset',
      ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
  }
});
router.get('/user-policies', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Fetch payments for the user
    const payments = await Payment.find({ user: userId }).sort({ createdAt: -1 });

    // Enhance payments with plan details
    const paymentsWithDetails = await Promise.all(
      payments.map(async (payment) => {
        let planName = 'Unknown Plan';
        let policyDetails = {};

        try {
          switch(payment.planType) {
            case 'bike':
              const bikePlan = await BikeInsurancePlan.findById(payment.plan);
              if (bikePlan) {
                planName = bikePlan.plan;
                policyDetails = {
                  insurer: bikePlan.insurer,
                  coverageAmount: bikePlan.coverageAmount,
                  cashlessGarages: bikePlan.cashlessGarages
                };
              }
              break;
            case 'car':
              const carPlan = await CarInsurancePlan.findById(payment.plan);
              if (carPlan) {
                planName = carPlan.plan;
                policyDetails = {
                  insurer: carPlan.insurer,
                  coverageAmount: carPlan.coverageAmount,
                  cashlessGarages: carPlan.cashlessGarages
                };
              }
              break;
            case 'health':
              const healthPlan = await HealthInsurancePlan.findById(payment.plan);
              if (healthPlan) {
                planName = healthPlan.plan;
                policyDetails = {
                  insurer: healthPlan.insurer,
                  coverageAmount: healthPlan.coverAmount,
                  cashlessHospitals: healthPlan.cashlessHospitals
                };
              }
              break;
          }
        } catch (err) {
          console.error(`Error fetching plan details for payment ${payment._id}:`, err);
        }

        return {
          ...payment.toObject(),
          planName,
          policyDetails
        };
      })
    );

    res.json({
      success: true,
      policies: paymentsWithDetails
    });
  } catch (error) {
    console.error('Error in /user-payments:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch payments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.resetToken !== token || Date.now() > user.resetTokenExpire) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. You can now log in.' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
});



module.exports = router;



