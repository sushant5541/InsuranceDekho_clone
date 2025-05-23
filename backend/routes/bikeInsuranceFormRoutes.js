const express = require('express');
const BikeInsuranceForm = require('../models/BikeInsuranceForm');
const { protect } = require('../middleware/auth');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();
const BikeInsurancePlan = require('../models/BikeInsurancePlan');

// Helper function to generate policy number
const generatePolicyNumber = () => {
  return 'BIKE' + 
    Date.now().toString().slice(-6) + 
    Math.floor(1000 + Math.random() * 9000);
};

// Helper function to validate and normalize form data
const normalizeFormData = (data) => {
  return {
    ...data,
    bikeNumber: data.bikeNumber?.toUpperCase().trim(),
    bikeModel: data.bikeModel || 'Not specified',
    bikeValue: Number(data.bikeValue) || 0,
    purchasedYear: Number(data.purchasedYear) || new Date().getFullYear(),
    mobileNumber: data.mobileNumber?.toString().trim(),
    insuranceType: ['Comprehensive', 'Third Party', 'Own Damage'].includes(data.insuranceType) 
      ? data.insuranceType 
      : 'Comprehensive'
  };
};

// @desc    Create or update bike insurance form (draft)
// @route   POST /api/bike-insurance-form
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const normalizedData = normalizeFormData(req.body);
    
    // Check for existing active insurance
    const existing = await BikeInsuranceForm.checkExistingInsurance(
      normalizedData.bikeNumber, 
      req.user._id
    );
    
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Active insurance already exists for this vehicle',
        existingPolicy: existing
      });
    }

    const form = await BikeInsuranceForm.findOneAndUpdate(
      { userId: req.user._id, status: 'draft' },
      { $set: normalizedData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      data: form
    });
  } catch (error) {
    console.error('Error saving bike insurance form:', error);
    const response = {
      success: false,
      error: 'Failed to save bike insurance form'
    };
    
    if (error.name === 'ValidationError') {
      response.validationErrors = Object.entries(error.errors).reduce((acc, [key, value]) => {
        acc[key] = value.message;
        return acc;
      }, {});
    } else {
      response.error = error.message;
    }

    res.status(400).json(response);
  }
});

// @desc    Complete bike insurance after payment
// @route   PUT /api/bike-insurance-form/:id/complete
// @access  Private
router.put('/:id/complete', protect, async (req, res) => {
  try {
    const { planId, paymentId, razorpayOrderId, razorpaySignature, paymentAmount, coverageDetails } = req.body;

    // Validate required fields more thoroughly
    const missingFields = [];
    if (!paymentId) missingFields.push('paymentId');
    if (!razorpayOrderId) missingFields.push('razorpayOrderId');
    if (!razorpaySignature) missingFields.push('razorpaySignature');
    if (!planId) missingFields.push('planId');
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`,
        requiredFields: ['paymentId', 'razorpayOrderId', 'razorpaySignature', 'planId']
      });
    }

    // Verify payment signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature',
        details: {
          receivedSignature: razorpaySignature,
          generatedSignature: generatedSignature
        }
      });
    }

    // Verify the insurance form exists and is in correct status
    const form = await BikeInsuranceForm.findOne({
      _id: req.params.id,
      userId: req.user._id,
      status: { $in: ['draft', 'pending_payment'] }
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        error: 'Form not found, already completed, or does not belong to user',
        details: {
          formId: req.params.id,
          userId: req.user._id,
          allowedStatuses: ['draft', 'pending_payment']
        }
      });
    }

    // Verify the plan exists
    const plan = await BikeInsurancePlan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Insurance plan not found',
        planId: planId
      });
    }

    // Prepare updates
    const updates = {
      planId,
      paymentId,
      razorpayOrderId,
      razorpaySignature,
      paymentAmount: paymentAmount || plan.price, // Fallback to plan price if not provided
      coverageDetails: coverageDetails || plan.coverageDetails || {},
      status: 'completed',
      policyNumber: form.policyNumber || generatePolicyNumber(),
      policyStartDate: new Date(),
      policyEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      paymentDate: new Date()
    };

    // Update with transaction for atomic operation
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const updatedForm = await BikeInsuranceForm.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true, runValidators: true, session }
      )
      .populate('planId')
      .populate('userId');

      // Verify the update was successful
      if (!updatedForm) {
        throw new Error('Failed to update insurance form');
      }

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        success: true,
        data: updatedForm
      });
    } catch (updateError) {
      await session.abortTransaction();
      session.endSession();
      throw updateError;
    }
  } catch (error) {
    console.error('Complete insurance error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      errors: error.errors
    });

    const response = {
      success: false,
      error: error.message
    };

    if (error.name === 'ValidationError') {
      response.validationErrors = Object.entries(error.errors).reduce((acc, [key, value]) => {
        acc[key] = value.message;
        return acc;
      }, {});
    }

    if (process.env.NODE_ENV === 'development') {
      response.stack = error.stack;
      response.fullError = JSON.stringify(error, Object.getOwnPropertyNames(error));
    }

    res.status(400).json(response);
  }
});
// @desc    Check existing bike insurance
// @route   GET /api/bike-insurance-form/check
// @access  Public
router.get('/check', async (req, res) => {
  try {
    const { bikeNumber } = req.query;
    
    if (!bikeNumber) {
      return res.status(400).json({
        success: false,
        error: 'Bike number is required'
      });
    }

    const existingPolicy = await BikeInsuranceForm.findOne({
      bikeNumber: bikeNumber.toUpperCase(),
      status: { $in: ['completed', 'pending_payment'] },
      policyEndDate: { $gt: new Date() }
    })
    .populate('planId', 'name price')
    .populate('userId', 'name email');

    if (existingPolicy) {
      return res.status(200).json({
        success: true,
        hasInsurance: true,
        policy: {
          policyNumber: existingPolicy.policyNumber,
          insurer: existingPolicy.planId?.name || 'Unknown',
          expiryDate: existingPolicy.policyEndDate,
          planPrice: existingPolicy.planId?.price,
          user: existingPolicy.userId
        }
      });
    }

    res.status(200).json({
      success: true,
      hasInsurance: false
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;