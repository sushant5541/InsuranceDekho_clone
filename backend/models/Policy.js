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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Policy = mongoose.model('Policy', policySchema);

module.exports = Policy;