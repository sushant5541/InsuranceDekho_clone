// backend/models/BikeInsurancePlan.js
const mongoose = require('mongoose');

const bikeInsurancePlanSchema = new mongoose.Schema({
  insurer: { type: String, required: true },
  planName: { type: String, required: true },
  logo: { type: String, required: true },
  coverageAmount: { type: String, required: true },
  cashlessGarages: { type: Number, required: true },
  claimSettled: { type: String, required: true },
  features: { type: [String], required: true },
  keyFeatures: { type: [String], required: true },
  price: { type: String, required: true },
  planType: { type: String, enum: ['Comprehensive', 'Third Party', 'Own Damage'], required: true },
  discount: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BikeInsurancePlan', bikeInsurancePlanSchema);