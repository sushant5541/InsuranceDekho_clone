const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const HealthInsurancePlan = require('../models/HealthInsurancePlan');
const CarInsurancePlan = require('../models/CarInsurance');
const BikeInsurancePlan = require('../models/BikeInsurancePlan');

// Health Insurance Plans
router.get('/health-plans', protect, admin, async (req, res) => {
  try {
    const plans = await HealthInsurancePlan.find({});
    res.json({ plans });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/health-plans', protect, admin, async (req, res) => {
  try {
    const plan = new HealthInsurancePlan(req.body);
    await plan.save();
    res.status(201).json(plan);
  } catch (err) {
    res.status(400).json({ message: 'Error creating plan' });
  }
});

router.put('/health-plans/:id', protect, admin, async (req, res) => {
  try {
    const plan = await HealthInsurancePlan.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(400).json({ message: 'Error updating plan' });
  }
});

router.delete('/health-plans/:id', protect, admin, async (req, res) => {
  try {
    const plan = await HealthInsurancePlan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json({ message: 'Plan deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Car Insurance Plans
router.get('/car-plans', protect, admin, async (req, res) => {
  try {
    const plans = await CarInsurancePlan.find({});
    res.json({ plans });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/car-plans', protect, admin, async (req, res) => {
  try {
    const plan = new CarInsurancePlan(req.body);
    await plan.save();
    res.status(201).json(plan);
  } catch (err) {
    res.status(400).json({ message: 'Error creating plan' });
  }
});

router.put('/car-plans/:id', protect, admin, async (req, res) => {
  try {
    const plan = await CarInsurancePlan.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(400).json({ message: 'Error updating plan' });
  }
});

router.delete('/car-plans/:id', protect, admin, async (req, res) => {
  try {
    const plan = await CarInsurancePlan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json({ message: 'Plan deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Bike Insurance Plans
router.get('/bike-plans', protect, admin, async (req, res) => {
  try {
    const plans = await BikeInsurancePlan.find({});
    res.json({ plans });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/bike-plans', protect, admin, async (req, res) => {
  try {
    const plan = new BikeInsurancePlan(req.body);
    await plan.save();
    res.status(201).json(plan);
  } catch (err) {
    res.status(400).json({ message: 'Error creating plan' });
  }
});

router.put('/bike-plans/:id', protect, admin, async (req, res) => {
  try {
    const plan = await BikeInsurancePlan.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(400).json({ message: 'Error updating plan' });
  }
});

router.delete('/bike-plans/:id', protect, admin, async (req, res) => {
  try {
    const plan = await BikeInsurancePlan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json({ message: 'Plan deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;