const express = require('express');
const router = express.Router();
const {
  getAdvisors,
  getAdvisorById,
  createAdvisor,
  updateAdvisor,
  deleteAdvisor
} = require('../controllers/advisorController');
const { protect, admin } = require('../middleware/auth');

// Public route
router.route('/').get(getAdvisors);

// Admin protected routes
router.route('/').post(protect, admin, createAdvisor);
router.route('/:id')
  .get(protect, admin, getAdvisorById)
  .put(protect, admin, updateAdvisor)
  .delete(protect, admin, deleteAdvisor);

module.exports = router;