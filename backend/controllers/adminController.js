const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    // Case-insensitive email search
    const admin = await Admin.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });

    if (!admin) {
      console.log('Admin not found for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Found admin:', admin.email);
    console.log('Comparing password...');

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log('Password comparison failed');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Password matched, generating token...');
    
    const token = jwt.sign(
      { id: admin._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        isAdmin: true
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = { authAdmin };