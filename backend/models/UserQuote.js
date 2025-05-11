// models/UserQuote.js
const userQuoteSchema = new mongoose.Schema({
    registrationNumber: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    carBrand: { type: String, required: true },
    carModel: { type: String, required: true },
    city: { type: String, required: true },
    purchaseYear: { type: Number, required: true },
    insuranceType: { type: String, required: true },
    selectedAddOns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AddOn' }],
    finalPremium: { type: Number, required: true },
    companiesCompared: [{ 
      company: { type: mongoose.Schema.Types.ObjectId, ref: 'InsuranceCompany' },
      premium: Number,
      plan: { type: mongoose.Schema.Types.ObjectId, ref: 'InsurancePlan' }
    }],
    createdAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('UserQuote', userQuoteSchema);