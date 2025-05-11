const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Admin = require('../models/Admin');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      // Extract token properly (note the space after 'Bearer')
      token = authHeader.split(' ')[1];
      
      // Additional check for empty token
      if (!token || token === 'null' || token === 'undefined') {
        res.status(401);
        throw new Error('Not authorized, invalid token format');
      }

      // Verify token with proper error handling
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user without throwing error if not found
      req.user = await User.findById(decoded.id).select('-password') || 
                await Admin.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      // Set isAdmin flag safely
      req.user.isAdmin = (await Admin.exists({ _id: decoded.id })) || false;

      next();
    } catch (error) {
      console.error('JWT Error:', error.message);
      // More specific error messages
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({ message: 'Session expired, please login again' });
      } else {
        res.status(401).json({ message: 'Not authorized, invalid token' });
      }
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as admin');
  }
};


module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { protect, admin };