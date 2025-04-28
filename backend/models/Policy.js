const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  name: String,
  category: String, 
  premium: Number,
  coverage: String,
  company: String,
  description: String
});

module.exports = mongoose.model('Policy', policySchema);
