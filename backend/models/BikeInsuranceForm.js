const mongoose = require('mongoose');

const bikeInsuranceFormSchema = new mongoose.Schema({
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
    ref: 'BikeInsurancePlan'
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
bikeInsuranceFormSchema.index({ userId: 1 });
bikeInsuranceFormSchema.index({ paymentId: 1 });
bikeInsuranceFormSchema.index({ status: 1 });
bikeInsuranceFormSchema.index({ createdAt: -1 });


const BikeInsuranceForm = mongoose.model('BikeInsuranceForm', bikeInsuranceFormSchema);

module.exports = BikeInsuranceForm;