const Policy = require('../models/Policy');

exports.getPolicies = async (req, res) => {
  const policies = await Policy.find();
  res.json(policies);
};

exports.addPolicy = async (req, res) => {
  const newPolicy = await Policy.create(req.body);
  res.json(newPolicy);
};
