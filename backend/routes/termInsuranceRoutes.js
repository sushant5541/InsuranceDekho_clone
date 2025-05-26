const express = require('express');
const router = express.Router();
const TermInsuranceForm = require('../models/TermInsuranceForm');
const auth = require('../middleware/auth');

// Handler functions
const submitTermInsurance = async (req, res) => {
  try {
    const form = new TermInsuranceForm({
      user: req.user._id,
      plan: req.body.plan,
      personalDetails: req.body.personalDetails,
      status: 'pending_payment'
    });

    const savedForm = await form.save();
    res.status(201).json(savedForm);
  } catch (error) {
    console.error('Error submitting term insurance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTermPayment = async (req, res) => {
  try {
    const updatedForm = await TermInsuranceForm.findByIdAndUpdate(
      req.params.id,
      {
        payment: req.body.paymentId,
        status: 'completed'
      },
      { new: true }
    );
    res.json(updatedForm);
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Route definitions
router.post('/', auth, submitTermInsurance);
router.put('/:id/payment', auth, updateTermPayment);

module.exports = router;