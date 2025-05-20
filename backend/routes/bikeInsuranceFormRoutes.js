const express = require('express');
const BikeInsuranceForm = require('../models/BikeInsuranceForm.js');
const { protect } = require('../middleware/auth.js');

const router = express.Router();

// @desc    Save bike insurance form data
// @route   POST /api/bike-insurance-form
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { carNumber, mobileNumber, carBrand, insuranceType, planId } = req.body;

    const formData = await BikeInsuranceForm.create({
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
// @route   PUT /api/bike-insurance-form/:id/payment
// @access  Private
router.put('/:id/payment', protect, async (req, res) => {
  try {
    const formData = await BikeInsuranceForm.findOneAndUpdate(
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