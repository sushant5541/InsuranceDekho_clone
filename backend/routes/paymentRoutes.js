const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const PaymentService = require('../Services/paymentService');
const {protect} = require('../middleware/auth');
const Razorpay = require('razorpay');
const Payment = require('../models/Payment')

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
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, planId } = req.body;
    const result = await paymentService.verifyPayment(
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      req.user._id,
      planId
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get payment details
router.get('/:paymentId', protect, async (req, res, next) => {
  try {
    const payment = await paymentService.getPaymentDetails(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

module.exports = router;