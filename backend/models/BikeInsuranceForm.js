// models/BikeInsuranceForm.js
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
  type: String,
  required: [true, 'Payment ID is required for completed policies'],
  validate: {
    validator: function(v) {
      return /^pay_\w+$/.test(v);
    },
    message: props => `${props.value} is not a valid payment ID!`
  }
},
  paymentAmount: {
    type: Number,
    required: true,
    min: 0,
    set: v => {
      // If string comes in, clean it
      if (typeof v === 'string') {
        return Number(v.replace(/[^0-9.-]+/g, ""));
      }
      return v;
    }
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

// Pre-save hook to set policy dates and numbers
bikeInsuranceFormSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed') {
    // Validate required fields for completed policy
    const requiredFields = ['planId', 'paymentId', 'bikeNumber', 'mobileNumber', 'bikeBrand', 'bikeType', 'purchasedYear'];
    const missingFields = requiredFields.filter(field => !this[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields for completed policy: ${missingFields.join(', ')}`);
    }
    
    // Set policy dates and number
    const currentDate = new Date();
    this.policyStartDate = currentDate;
    this.policyEndDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1));
    
    if (!this.policyNumber) {
      this.policyNumber = generatePolicyNumber();
    }
    
    // Ensure payment amount is set
    if (!this.paymentAmount && this.planId?.price) {
      this.paymentAmount = this.planId.price;
    }
  }
  next();
});

// Add a static method to check for existing insurance
bikeInsuranceFormSchema.statics.checkExistingInsurance = async function(bikeNumber, userId = null) {
  const query = {
    bikeNumber: bikeNumber.toUpperCase(),
    status: { $in: ['completed', 'pending_payment'] },
    policyEndDate: { $gt: new Date() }
  };
  
  // Optionally filter by user if provided
  if (userId) {
    query.userId = userId;
  }

  const existingPolicy = await this.findOne(query)
    .populate('planId', 'name price')
    .populate('userId', 'name email');
  
  return existingPolicy;
};

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

// Helper function to generate policy number
function generatePolicyNumber() {
  return 'BIKE' + 
    Date.now().toString().slice(-6) + 
    Math.floor(1000 + Math.random() * 9000);
}

const BikeInsuranceForm = mongoose.model('BikeInsuranceForm', bikeInsuranceFormSchema);

module.exports = BikeInsuranceForm;