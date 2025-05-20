const mongoose = require('mongoose');

const carInsuranceFormSchema = new mongoose.Schema({
  carNumber: {
    type: String,
    required: [true, 'Car number is required'],
    uppercase: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
  },
  carBrand: {
    type: String,
    required: [true, 'Car brand is required'],
    trim: true
  },
  insuranceType: {
    type: String,
    enum: ['Comprehensive', 'Third Party', 'Own Damage'],
    default: 'Comprehensive'
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CarInsurancePlan'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'completed', 'failed'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Add indexes for better performance
carInsuranceFormSchema.index({ userId: 1 });
carInsuranceFormSchema.index({ paymentId: 1 });
carInsuranceFormSchema.index({ status: 1 });
carInsuranceFormSchema.index({ createdAt: -1 });

const CarInsuranceForm = mongoose.model('CarInsuranceForm', carInsuranceFormSchema);

module.exports = CarInsuranceForm;