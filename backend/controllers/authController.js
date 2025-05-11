const User = require('../models/User');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const validator = require('validator');


const generateAuthResponse = (user, isAdmin = false) => {
  const token = jwt.sign(
    { id: user._id, isAdmin }, // Ensure isAdmin is included here
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: isAdmin || user.isAdmin
    }
  };
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ name, email, password });  

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    });

    res.status(201).json(generateAuthResponse(user));
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // ✅ Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // ✅ Respond with token and user
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
;


exports.profile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.gender = req.body.gender || user.gender;
    user.dob = req.body.dob || user.dob;
    user.mobile = req.body.mobile || user.mobile;

    await user.save();

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

  exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  
      // Save token to user document (optional, useful for verifying later)
      user.resetToken = token;
      user.resetTokenExpire = Date.now() + 15 * 60 * 1000;
      await user.save();
  
      // Send email
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
  
      const resetUrl = `http://localhost:3000/reset-password/${token}`;
      const message = `Click the link to reset your password: ${resetUrl}`;
  
      await transporter.sendMail({
        from: '"InsuranceDekho Clone" <no-reply@example.com>',
        to: email,
        subject: 'Password Reset',
        text: message
      });
  
      res.json({ message: 'Password reset link sent to your email.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

  exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
  
      if (!user || user.resetToken !== token || Date.now() > user.resetTokenExpire) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
  
      user.password = await bcrypt.hash(password, 10);
      user.resetToken = undefined;
      user.resetTokenExpire = undefined;
      await user.save();
  
      res.json({ message: 'Password reset successful. You can now log in.' });
    } catch (err) {
      res.status(400).json({ message: 'Invalid or expired token' });
    }
  }


  