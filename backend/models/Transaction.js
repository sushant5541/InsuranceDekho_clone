const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  policyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy' },
  date: Date,
  amount: Number,
  status: String
});

module.exports = mongoose.model('Transaction', transactionSchema);
