const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
require('dotenv').config();

class PaymentService {
  constructor() {
    // Check if environment variables exist
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay keys are missing in environment variables');
    }

    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }

  async createOrder(amount, currency, userId, planId, planType) {
    try {
      const options = {
        amount: amount * 100, // Convert to paise
        currency: currency || 'INR',
        receipt: `ins_${planType}_${Date.now()}`,
        payment_capture: 1
      };

      const order = await this.razorpay.orders.create(options);
      
      const payment = await Payment.create({
        user: userId,
        plan: planId,
        planType,
        razorpayOrderId: order.id,
        amount: order.amount,
        currency: order.currency,
        status: 'created'
      });

      return {
        success: true,
        order,
        payment
      };
    } catch (error) {
      console.error('Order creation error:', error);
      throw new Error('Failed to create payment order');
    }
  }

async verifyPayment(paymentId, orderId, signature, userId, planId, planType, planDetails) {
  try {
      // Verify signature
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      if (generatedSignature !== signature) {
        await Payment.findOneAndUpdate(
          { razorpayOrderId: orderId },
          { status: 'failed' }
        );
        return { success: false, error: 'Invalid signature' };
      }

      // Update payment record
     const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: orderId },
      {
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
        status: 'captured',
        policyIssued: true,
        receipt: `INS-${planId}-${Date.now()}`,
        policyDetails: planDetails, // Store the complete policy details
        planType: planType
      },
      { new: true }
    );

    return {
      success: true,
      payment: {
        _id: payment._id,
        planType: payment.planType,
        amount: payment.amount,
        status: payment.status,
        receipt: payment.receipt,
        createdAt: payment.createdAt,
        policyDetails: payment.policyDetails
      },
      message: 'Payment verified successfully'
    };
  } catch (error) {
    console.error('Payment verification error:', error);
    throw new Error('Payment verification failed');
  }
}
  async getPaymentDetails(paymentId) {
    return await Payment.findById(paymentId).populate('user plan');
  }
}

// Export the class itself, not an instance
module.exports = PaymentService;