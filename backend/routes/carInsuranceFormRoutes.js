const express = require('express');
const CarInsuranceForm = require('../models/CarInsurnaceForm.js');
const { protect } = require('../middleware/auth.js');

const router = express.Router();

// @desc    Save car insurance form data
// @route   POST /api/car-insurance-form
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { carNumber, mobileNumber, carBrand, insuranceType, planId } = req.body;

    const formData = await CarInsuranceForm.create({
      carNumber,
      mobileNumber,
      carBrand,
      insuranceType,
      planId,
      userId: req.user._id
    });

    res.status(201).json({
      success: true,
      data: formData
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Update with payment ID after successful payment
// @route   PUT /api/car-insurance-form/:id/payment
// @access  Private
router.put('/:id/payment', protect, async (req, res) => {
  try {
    const formData = await CarInsuranceForm.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { paymentId: req.body.paymentId },
      { new: true }
    );

    if (!formData) {
      return res.status(404).json({
        success: false,
        error: 'Form data not found'
      });
    }

    res.json({
      success: true,
      data: formData
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;