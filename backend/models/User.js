const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  gender: { type: String, default: 'Male' },
  dob: { type: String },
  mobile: { type: String },
  role: { type: String, default: 'user' }
});

module.exports = mongoose.model('User', userSchema);
