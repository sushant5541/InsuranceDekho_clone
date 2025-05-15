const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Admin = require('../models/Admin');

const protect = asyncHandler(async (req, res, next) => {
  // Check if authorization header exists
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  // Extract token safely
  const authHeader = req.headers.authorization;
  const tokenParts = authHeader.split(' ');
  
  // Validate token format
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Invalid authorization format' });
  }

  const token = tokenParts[1];
  
  // Basic token validation
  if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Validate decoded token
    if (!decoded?.id) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    const userId = new mongoose.Types.ObjectId(decoded.id);

    // Check both collections simultaneously
    const [user, adminUser] = await Promise.all([
      User.findById(userId).select('-password').lean(),
      Admin.findById(userId).select('-password').lean()
    ]);

    const authenticatedUser = adminUser || user;
    
    if (!authenticatedUser) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach complete user information with proper admin flag
    req.user = {
      ...authenticatedUser,
      _id: userId,
      isAdmin: !!adminUser // True if found in Admin collection
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    // More specific error messages
    let errorMessage = 'Authentication failed';
    if (error.name === 'TokenExpiredError') {
      errorMessage = 'Token expired';
    } else if (error.name === 'JsonWebTokenError') {
      errorMessage = 'Invalid token';
    }

    res.status(401).json({ 
      message: errorMessage,
      error: error.message 
    });
  }
});

const admin = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ message: 'User not authenticated' });
  }

  if (req.user?.isAdmin) {
    next();
  } else {
    res.status(403).json({ 
      message: 'Admin privileges required',
      user: {
        id: req.user?._id,
        isAdmin: req.user?.isAdmin
      }
    });
  }
};

module.exports = { protect, admin };