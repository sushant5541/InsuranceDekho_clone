const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },  // e.g., Car Insurance, Bike Insurance, Health Insurance
  description: { type: String }
});

module.exports = mongoose.model('Category', categorySchema);
