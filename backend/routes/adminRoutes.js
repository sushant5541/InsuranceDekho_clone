const express = require('express');
const router = express.Router();
const { authAdmin } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/adminMiddleware');

// Public route
router.post('/login', authAdmin);

// Protected routes
router.get('/profile', protect, admin, (req, res) => {
  res.json(req.admin);
});

module.exports = router;