// const express = require('express');
// const router = express.Router();
// const TermInsurance = require('../models/TermInsuranceForm');
// const auth = require('../middleware/auth');

// // POST /api/term-insurance/forms
// router.post('/forms', auth, async (req, res) => {
//   try {
//     const form = new TermInsuranceForm({
//       user: req.body.userId,
//       plan: req.body.plan,
//       personalDetails: req.body.personalDetails,
//       status: 'pending_payment'
//     });

//     const savedForm = await form.save();
//     res.status(201).json({
//       success: true,
//       formId: savedForm._id,
//       message: 'Form submitted successfully'
//     });
//   } catch (err) {
//     console.error('Form submission error:', err);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while submitting form'
//     });
//   }
// });

// // PUT /api/term-insurance/forms/:id/payment
// router.put('/forms/:id/payment', auth, async (req, res) => {
//   try {
//     const updatedForm = await TermInsuranceForm.findByIdAndUpdate(
//       req.params.id,
//       {
//         payment: req.body.paymentId,
//         status: 'completed'
//       },
//       { new: true, runValidators: true }
//     );

//     if (!updatedForm) {
//       return res.status(404).json({
//         success: false,
//         message: 'Form not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Payment updated successfully',
//       form: updatedForm
//     });
//   } catch (err) {
//     console.error('Payment update error:', err);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while updating payment'
//     });
//   }
// });

// module.exports = router;