const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },                 
  description: { type: String },
  premium: { type: Number, required: true },              
  coverageAmount: { type: Number },                       
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, 
  features: [{ type: String }],                           
  insurer: { type: String },                              
  planType: { type: String },                             
});

module.exports = mongoose.model('Product', productSchema);
