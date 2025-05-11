// middleware/adminMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Admin = require('../models/Admin');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find admin by ID from token
      req.admin = await Admin.findById(decoded.id).select('-password');
      
      if (!req.admin) {
        res.status(401);
        throw new Error('Not authorized, admin not found');
      }
      
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const admin = (req, res, next) => {
  if (req.admin && req.admin.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as admin');
  }
};

module.exports = { protect, admin };