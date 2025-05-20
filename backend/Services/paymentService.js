const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const BikeInsuranceForm = require('../models/BikeInsuranceForm');
require('dotenv').config();

class PaymentService {
  constructor() {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay keys are missing in environment variables');
    }

    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    // Try to load CarInsuranceForm but don't fail if it doesn't exist
    try {
      this.CarInsuranceForm = require('../models/CarInsuranceForm');
    } catch (error) {
      console.warn('CarInsuranceForm model not found. Car insurance functionality will be limited.');
      this.CarInsuranceForm = null;
    }
  }

  async createOrder(amount, currency, userId, planId, planType, formId) {
    try {
      // Validate planType
      const normalizedPlanType = planType.toLowerCase();
      if (!['bike', 'car'].includes(normalizedPlanType)) {
        throw new Error('Invalid insurance type');
      }

      const options = {
        amount: amount * 100,
        currency: currency || 'INR',
        receipt: `ins_${normalizedPlanType}_${Date.now()}`,
        payment_capture: 1,
        notes: {
          formId: formId
        }
      };

      const order = await this.razorpay.orders.create(options);
      
      // Update appropriate form based on plan type
      if (normalizedPlanType === 'bike') {
        await BikeInsuranceForm.findByIdAndUpdate(formId, {
          planId: planId,
          insuranceType: normalizedPlanType
        });
      } else if (normalizedPlanType === 'car' && this.CarInsuranceForm) {
        await this.CarInsuranceForm.findByIdAndUpdate(formId, {
          planId: planId,
          insuranceType: normalizedPlanType
        });
      }

      const payment = await Payment.create({
        user: userId,
        plan: planId,
        planType: normalizedPlanType,
        razorpayOrderId: order.id,
        amount: order.amount,
        currency: order.currency,
        status: 'created',
        formReference: formId
      });

      return {
        success: true,
        order,
        payment
      };
    } catch (error) {
      console.error('Order creation error:', error);
      throw new Error(error.message || 'Failed to create payment order');
    }
  }

  async verifyPayment(paymentId, orderId, signature, userId, planId, planType, formId) {
    try {
      const normalizedPlanType = planType.toLowerCase();

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
          planType: normalizedPlanType
        },
        { new: true }
      );

      // Update appropriate form based on plan type
      if (normalizedPlanType === 'bike') {
        await BikeInsuranceForm.findByIdAndUpdate(formId, {
          paymentId: payment._id,
          status: 'completed'
        });
      } else if (normalizedPlanType === 'car' && this.CarInsuranceForm) {
        await this.CarInsuranceForm.findByIdAndUpdate(formId, {
          paymentId: payment._id,
          status: 'completed'
        });
      }

      return {
        success: true,
        payment: {
          _id: payment._id,
          planType: payment.planType,
          amount: payment.amount,
          status: payment.status,
          receipt: payment.receipt,
          createdAt: payment.createdAt
        },
        message: 'Payment verified successfully'
      };
    } catch (error) {
      console.error('Payment verification error:', error);
      throw new Error(error.message || 'Payment verification failed');
    }
  }

  async getPaymentDetails(paymentId) {
    try {
      const payment = await Payment.findById(paymentId)
        .populate('user plan');
      
      // Populate form reference based on plan type
      if (payment.planType === 'bike') {
        await payment.populate({
          path: 'formReference',
          model: 'BikeInsuranceForm'
        }).execPopulate();
      } else if (payment.planType === 'car' && this.CarInsuranceForm) {
        await payment.populate({
          path: 'formReference',
          model: 'CarInsuranceForm'
        }).execPopulate();
      }

      return payment;
    } catch (error) {
      console.error('Error fetching payment details:', error);
      throw new Error('Failed to fetch payment details');
    }
  }
}

module.exports = PaymentService;