const mongoose = require('mongoose');

const policySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    coverageAmount: {
      type: Number,
      required: true,
    },
    premium: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number, // in years
      required: true,
    },
    policyType: {
      type: String,
      enum: ['life', 'health', 'car', 'bike'],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    purchaseDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active'
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Policy', policySchema);