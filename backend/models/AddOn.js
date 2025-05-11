// models/AddOn.js
const addOnSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    icon: { type: String },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    applicableFor: [{ type: String }], // Comprehensive, Third Party, etc.
    benefits: [String],
    createdAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('AddOn', addOnSchema);