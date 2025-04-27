const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },                 // Policy name
  description: { type: String },
  premium: { type: Number, required: true },              // e.g., Rs 3000/year
  coverageAmount: { type: Number },                       // e.g., Rs 5 lakh coverage
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Car/Bike/Health
  features: [{ type: String }],                           // e.g., ["24/7 support", "Cashless claim"]
  insurer: { type: String },                              // e.g., ICICI Lombard, HDFC Ergo
  planType: { type: String },                             // e.g., Comprehensive, Third Party
});

module.exports = mongoose.model('Product', productSchema);
