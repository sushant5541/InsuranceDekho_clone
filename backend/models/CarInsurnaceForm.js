const mongoose = require('mongoose');

const carInsuranceFormSchema = new mongoose.Schema({
  // Vehicle Information
carNumber: {
  type: String,
  required: [true, 'Car number is required'],
  uppercase: true,
  trim: true,
  validate: {
    validator: function(v) {
      return /^[A-Z]{2}[0-9]{1,2}[A-Z]{0,3}[0-9]{4}$/.test(v);
    },
    message: props => `${props.value} is not a valid car number!`
  }
},
  carBrand: {
    type: String,
    required: [true, 'Car brand is required'],
    trim: true,
    enum: [
      'Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Toyota',
      'Honda', 'Kia', 'Volkswagen', 'Renault', 'Ford'
    ]
  },
  carModel: {
    type: String,
    trim: true
  },
  carType: {
    type: String,
    required: [true, 'Car type is required'],
    enum: ['Petrol', 'CNG', 'Diesel', 'Electric']
  },
  carValue: {
    type: Number,
    min: [0, 'Car value cannot be negative']
  },
  purchasedYear: {
    type: Number,
    required: [true, 'Purchased year is required'],
    min: [2000, 'Year must be 2000 or later'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
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
    ref: 'CarInsurancePlan',
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

carInsuranceFormSchema.pre('save', function(next) {
  // Set default policy dates when status changes to completed
  if (this.isModified('status') && this.status === 'completed') {
    const currentDate = new Date();
    this.policyStartDate = currentDate;
    this.policyEndDate = new Date(currentDate.setDate(currentDate.getDate() + 365)); // 1 year policy
  }
  
  // Generate policy number when completing
  if (this.isModified('status') && this.status === 'completed' && !this.policyNumber) {
    this.policyNumber = generatePolicyNumber();
  }
  
  next();
});

// Add a static method to check for existing insurance
carInsuranceFormSchema.statics.checkExistingInsurance = async function(carNumber, userId = null) {
  const query = {
    carNumber: carNumber.toUpperCase(),
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
carInsuranceFormSchema.index({ carNumber: 1 });
carInsuranceFormSchema.index({ userId: 1 });
carInsuranceFormSchema.index({ paymentId: 1 });
carInsuranceFormSchema.index({ status: 1 });
carInsuranceFormSchema.index({ createdAt: -1 });

// Virtual for policy duration
carInsuranceFormSchema.virtual('policyDuration').get(function() {
  if (this.policyStartDate && this.policyEndDate) {
    return (this.policyEndDate - this.policyStartDate) / (1000 * 60 * 60 * 24) + ' days';
  }
  return null;
});

const CarInsuranceForm = mongoose.model('CarInsuranceForm', carInsuranceFormSchema);

module.exports = CarInsuranceForm;