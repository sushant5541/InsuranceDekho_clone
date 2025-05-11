// controllers/adminUserController.js
const User = require('../models/User');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});


const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.mobile = req.body.mobile || user.mobile;
    user.gender = req.body.gender || user.gender;
    user.dob = req.body.dob || user.dob;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      gender: updatedUser.gender,
      dob: updatedUser.dob,
      isActive: updatedUser.isActive,
      isAdmin: updatedUser.isAdmin
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.isActive = req.body.isActive;
    const updatedUser = await user.save();
    res.json({ isActive: updatedUser.isActive });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

if (user) {
  await User.deleteOne({ _id: req.params.id }); // ✅ Correct approach
  res.json({ message: 'User deleted' });
} else {
  res.status(404).json({ message: 'User not found' });
}

});

// @desc    Invite new user
// @route   POST /api/admin/users/invite
// @access  Private/Admin
const inviteUser = asyncHandler(async (req, res) => {
  const { email, name, role } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Generate random password
  const randomPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(randomPassword, 10);

  // Create user based on role
  let user;
  if (role === 'admin') {
    user = await Admin.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: true
    });
  } else {
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdvisor: role === 'advisor'
    });
  }

  // Send invitation email
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: '"Insurance Admin" <no-reply@insuranceapp.com>',
    to: email,
    subject: 'Your Insurance Account Invitation',
    html: `
      <h2>Welcome to Insurance Admin</h2>
      <p>You've been invited to join our insurance platform as a ${role}.</p>
      <p>Your temporary password is: <strong>${randomPassword}</strong></p>
      <p>Please login at <a href="http://localhost:3000/login">http://localhost:3000/login</a> and change your password.</p>
    `
  };

  await transporter.sendMail(mailOptions);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role,
    message: 'Invitation sent successfully'
  });
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  deleteUser,
  inviteUser
};