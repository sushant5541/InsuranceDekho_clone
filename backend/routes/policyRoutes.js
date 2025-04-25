const express = require('express');
const { getPolicies, addPolicy } = require('../controllers/policyController');
const auth = require('../middleware/auth');

const router = express.Router();
router.get('/', getPolicies);
router.post('/', auth, addPolicy);

module.exports = router;
