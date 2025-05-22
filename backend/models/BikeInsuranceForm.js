const mongoose = require('mongoose');

const bikeInsuranceFormSchema = new mongoose.Schema({
  // Vehicle Information
  bikeNumber: {
    type: String,
    required: [true, 'Bike number is required'],
    uppercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[A-Z]{2}[0-9]{1,2}[A-Z]{0,3}[0-9]{4}$/.test(v);
      },
      message: props => `${props.value} is not a valid bike number!`
    }
  },
  bikeBrand: {
    type: String,
    required: [true, 'Bike brand is required'],
    trim: true,
    enum: [
      'Honda', 'Kawasaki', 'Yamaha', 'Hero', 'Royal Enfield',
      'KTM', 'Suzuki', 'Bajaj', 'TVS', 'Jawa'
    ]
  },
  bikeModel: {
    type: String,
    trim: true
  },
  bikeType: {
    type: String,
    required: [true, 'Bike type is required'],
    enum: ['Petrol', 'Diesel', 'Electric']
  },
  purchasedYear: {
    type: Number,
    required: [true, 'Purchased year is required'],
    min: [2000, 'Year must be 2000 or later'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  },
  bikeValue: {
    type: Number,
    min: [0, 'Bike value cannot be negative']
  },

  // Personal Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    validate: {
      validator: function(v) {
        return /^[6-9]\d{9}$/.test(v);
      },
      message: props => `${props.value} is not a valid mobile number!`
    }
  },

  // Insurance Details
  insuranceType: {
    type: String,
    required: true,
    enum: ['Comprehensive', 'Third Party', 'Own Damage'],
    default: 'Comprehensive'
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BikeInsurancePlan',
    required: function() {
      return this.status === 'completed';
    }
  },
  coverageDetails: {
    type: Map,
    of: String
  },

  // Payment Information
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: function() {
      return this.status === 'completed';
    }
  },
  paymentAmount: {
    type: Number,
    min: 0
  },
  paymentDate: {
    type: Date
  },

  // Policy Information
  policyNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  policyStartDate: {
    type: Date
  },
  policyEndDate: {
    type: Date
  },

  // Status Tracking
  status: {
    type: String,
    enum: ['draft', 'pending_payment', 'completed', 'cancelled', 'expired'],
    default: 'draft'
  },
  rejectionReason: {
    type: String
  },

  // Timestamps
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
      ret.id = ret._id;
      delete ret._id;
      return ret;
    }
  },
  toObject: {
    virtuals: true
  }
});

// Indexes for better query performance
bikeInsuranceFormSchema.index({ bikeNumber: 1 });
bikeInsuranceFormSchema.index({ userId: 1 });
bikeInsuranceFormSchema.index({ paymentId: 1 });
bikeInsuranceFormSchema.index({ status: 1 });
bikeInsuranceFormSchema.index({ createdAt: -1 });

// Virtual for policy duration
bikeInsuranceFormSchema.virtual('policyDuration').get(function() {
  if (this.policyStartDate && this.policyEndDate) {
    return (this.policyEndDate - this.policyStartDate) / (1000 * 60 * 60 * 24) + ' days';
  }
  return null;
});

const BikeInsuranceForm = mongoose.model('BikeInsuranceForm', bikeInsuranceFormSchema);

module.exports = BikeInsuranceForm;