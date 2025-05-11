const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BikeInsurancePlan',
    required: true
  },
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  amount: { type: Number, required: true }, // in paise
  currency: { type: String, default: 'INR' },
  status: { 
    type: String, 
    enum: ['created', 'captured', 'failed', 'refunded'],
    default: 'created'
  },
  policyIssued: { type: Boolean, default: false },
  receipt: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);