const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, profile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.get('/profile', protect, profile) 
router.put('/profile', protect, updateProfile);

const bcrypt = require('bcryptjs');

router.get('/verify-admin', protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    res.json({ isAdmin: !!admin });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/reset-password/:token', async (req, res) => {
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
});

// routes/auth.js
router.get('/verify-reset-token/:token', (req, res) => {
  const { token } = req.params;
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true });
  } catch (err) {
    res.status(400).json({ valid: false, message: 'Invalid or expired token' });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
});

module.exports = router;



