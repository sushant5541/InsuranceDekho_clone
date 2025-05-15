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

    res.status(201).json(generateAuthResponse(user));
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Case-insensitive email search
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return user data without password
    const userData = user.toObject();
    delete userData.password;

    res.json({
      success: true,
      token,
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
    // Enhanced validation
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized - Invalid user session' 
      });
    }

    // Validate input data
    const { name, gender, dob, mobile } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    // Find user in either User or Admin collection
    const [user, adminUser] = await Promise.all([
      User.findById(req.user._id),
      Admin.findById(req.user._id)
    ]);

    const userToUpdate = user || adminUser;
    if (!userToUpdate) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Update fields with validation
    userToUpdate.name = name;
    if (gender) userToUpdate.gender = gender;
    if (dob) userToUpdate.dob = dob;
    if (mobile) {
      if (!/^\d{10}$/.test(mobile)) {
        return res.status(400).json({
          success: false,
          message: 'Mobile number must be 10 digits'
        });
      }
      userToUpdate.mobile = mobile;
    }

    await userToUpdate.save();

    // Return updated user data without password
    const userData = userToUpdate.toObject();
    delete userData.password;

    res.json({ 
      success: true,
      message: 'Profile updated successfully',
      user: userData
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during profile update',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
// Request password reset (POST remains appropriate here)
exports.forgotPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Case-insensitive email search
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') } 
    });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found with this email' 
      });
    }

    // Hash password with consistent salt rounds (10)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ 
      success: true,
      message: 'Password has been successfully updated' 
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during password reset',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};