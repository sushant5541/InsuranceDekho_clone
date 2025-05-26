const mongoose = require('mongoose');

const TermInsuranceFormSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  plan: {
    type: Object,
    required: [true, 'Plan details are required']
  },
  personalDetails: {
    type: Object,
    required: [true, 'Personal details are required']
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'pending_payment', 'completed', 'rejected'],
      message: '{VALUE} is not a valid status'
    },
    default: 'pending'
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('TermInsuranceForm', TermInsuranceFormSchema);