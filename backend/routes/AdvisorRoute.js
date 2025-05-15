// routes/AdvisorRoute.js
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
router.use(protect); // Apply protect middleware to all routes below
router.use(admin);   // Apply admin middleware to all routes below

router.route('/').post(createAdvisor);
router.route('/:id')
  .get(getAdvisorById)
  .put(updateAdvisor)
  .delete(deleteAdvisor);

module.exports = router;