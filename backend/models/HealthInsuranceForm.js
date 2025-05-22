const mongoose = require('mongoose');

const healthInsuranceFormSchema = new mongoose.Schema({
  // User Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    validate: {
      validator: function(v) {
        return /^[6-9]\d{9}$/.test(v);
      },
      message: props => `${props.value} is not a valid mobile number!`
    }
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  address: String,
  city: String,
  pincode: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\d{6}$/.test(v);
      },
      message: props => `${props.value} is not a valid pincode!`
    }
  },
  whatsAppOptIn: {
    type: Boolean,
    default: true
  },

  // Member Information
  members: {
    self: { type: Boolean, default: false },
    spouse: { type: Boolean, default: false },
    mother: { type: Boolean, default: false },
    father: { type: Boolean, default: false },
    children: [{
      type: { type: String, enum: ['son', 'daughter'] },
      age: { type: Number, min: 0, max: 25 }
    }]
  },

  // Insurance Details
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HealthInsurancePlan'
  },
  coverageDetails: {
    type: Map,
    of: String
  },

  // Payment Information
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
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
  policyStartDate: Date,
  policyEndDate: Date,

  // Status Tracking
  status: {
    type: String,
    enum: ['draft', 'pending_payment', 'completed', 'cancelled', 'expired'],
    default: 'draft'
  },
  rejectionReason: String,

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
healthInsuranceFormSchema.index({ userId: 1 });
healthInsuranceFormSchema.index({ paymentId: 1 });
healthInsuranceFormSchema.index({ status: 1 });
healthInsuranceFormSchema.index({ createdAt: -1 });

// Virtual for policy duration
healthInsuranceFormSchema.virtual('policyDuration').get(function() {
  if (this.policyStartDate && this.policyEndDate) {
    const days = Math.round((this.policyEndDate - this.policyStartDate) / (1000 * 60 * 60 * 24));
    return `${days} days`;
  }
  return null;
});

// Pre-save hook to generate policy number
healthInsuranceFormSchema.pre('save', function(next) {
  if (this.isNew && this.status === 'completed' && !this.policyNumber) {
    this.policyNumber = `HLTH${Date.now().toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`;
  }
  next();
});

const HealthInsuranceForm = mongoose.model('HealthInsuranceForm', healthInsuranceFormSchema);

module.exports = HealthInsuranceForm;