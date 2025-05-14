const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const PaymentService = require('../Services/paymentService');
const {protect} = require('../middleware/auth');
const Razorpay = require('razorpay');
const Payment = require('../models/Payment')
const path = require('path');
const fs = require('fs');


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,       // store in .env
  key_secret: process.env.RAZORPAY_KEY_SECRET // store in .env
});

// Create an instance of PaymentService
const paymentService = new PaymentService();

// Create payment order
router.post('/create-order', protect, async (req, res) => {
try {
    const { amount, planId, planType } = req.body;

    // Detailed validation
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be a positive number'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid plan ID format'
      });
    }

    const validPlanTypes = ['bike', 'car', 'health'];
    if (!validPlanTypes.includes(planType.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: `Invalid plan type. Must be one of: ${validPlanTypes.join(', ')}`
      });
    }


    // Create order
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `ins_${planType}_${Date.now()}`
    });

    // Save to database
    await Payment.create({
      user: req.user._id,
      plan: planId,
      planType,
      razorpayOrderId: order.id,
      amount: order.amount,
      status: 'created'
    });

    res.json({
      success: true,
      order,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('Order Creation Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment order',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Verify payment
router.post('/verify', protect, async (req, res, next) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, planId, planType } = req.body;
    
    // Fetch the plan details based on planType
    let planModel;
    switch(planType) {
      case 'bike':
        planModel = require('../models/BikeInsurancePlan');
        break;
      case 'car':
        planModel = require('../models/CarInsurancePlan');
        break;
      case 'health':
        planModel = require('../models/HealthInsurancePlan');
        break;
      default:
        return res.status(400).json({ error: 'Invalid plan type' });
    }

    const planDetails = await planModel.findById(planId);
    if (!planDetails) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const result = await paymentService.verifyPayment(
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      req.user._id,
      planId,
      planType,
      planDetails.toObject() // Store the complete plan details
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get payment details
router.get('/:paymentId', protect, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/user-payments', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // First get basic payments
    const payments = await Payment.find({ user: userId })
      .sort({ createdAt: -1 });

    // Enhanced version with plan details
    const paymentsWithDetails = await Promise.all(
      payments.map(async (payment) => {
        let planDetails = {};
        
        try {
          switch(payment.planType) {
            case 'bike':
              planDetails = await BikeInsurancePlan.findById(payment.plan)
                .select('plan insurer coverageAmount price cashlessGarages')
                .lean();
              break;
            case 'car':
              planDetails = await CarInsurancePlan.findById(payment.plan)
                .select('plan insurer coverageAmount price cashlessGarages')
                .lean();
              break;
            case 'health':
              planDetails = await HealthInsurancePlan.findById(payment.plan)
                .select('plan insurer coverAmount yearlyPremium monthlyPremium cashlessHospitals')
                .lean();
              break;
          }
        } catch (err) {
          console.error(`Error fetching plan details for payment ${payment._id}:`, err);
        }

        return {
          ...payment.toObject(),
          policyDetails: planDetails || null
        };
      })
    );
      
    res.json(paymentsWithDetails);
  } catch (error) {
    console.error('Error in /user-payments:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch payments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
// Delete a policy
router.delete('/:policyId', protect, async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.policyId,
      user: req.user._id
    });

    if (!payment) {
      return res.status(404).json({ error: 'Policy not found' });
    }

    // In a real application, you might want to:
    // 1. Check if the policy is still active
    // 2. Process any refunds if applicable
    // 3. Notify the insurance provider

    await payment.deleteOne();
    res.json({ success: true, message: 'Policy deleted successfully' });
  } catch (error) {
    console.error('Error deleting policy:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete policy',
      message: error.message 
    });
  }
});


router.get('/download/:paymentId', protect, async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.paymentId,
      user: req.user._id,
      status: 'captured'
    });

    if (!payment) {
      return res.status(404).json({ error: 'Policy not found or not paid for' });
    }

    // Simulating a PDF or policy file download (replace with real file or S3 URL)
    const filePath = path.join(__dirname, '../policies', `${payment._id}.pdf`);

    // For development: check if file exists (in production, use S3, Cloudinary, etc.)
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Policy file not found on server' });
    }

    res.download(filePath, `Policy_${payment._id}.pdf`);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download policy' });
  }
});

module.exports = router;