const mongoose  = require('mongoose')

const healthInsurancePlanSchema = new mongoose.Schema({
  insurer: String,
  planName: String,
  logo: String,
  coverAmount: String,
  cashlessHospitals: Number,
  claimSettled: String,
  features: [String],
  addons: Number,
  discount: String,
  monthlyPremium: String,
  yearlyPremium: String
});

const HealthInsurancePlan = mongoose.model('HealthInsurancePlan', healthInsurancePlanSchema);

module.exports = HealthInsurancePlan;

