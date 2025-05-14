const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getPolicies,
  createPolicy,
  getPolicyById,
  updatePolicy,
  deletePolicy,
} = require('../controllers/policyController');

router.route('/')
  .get(protect, admin, getPolicies)
  .post(protect, admin, createPolicy);

router.route('/:id')
  .get(protect, admin, getPolicyById)
  .put(protect, admin, updatePolicy)
  .delete(protect, admin, deletePolicy);

module.exports = router;