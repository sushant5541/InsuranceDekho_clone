const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Admin = require('../models/Admin');

const protect = asyncHandler(async (req, res, next) => {
  try {
    // Validate authorization header structure
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        message: 'Authorization header required' 
      });
    }

    // Extract and validate token format
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid authorization format. Use: Bearer <token>' 
      });
    }

    const token = tokenParts[1];
    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token structure' 
      });
    }

    // Verify token and decode
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token payload' 
      });
    }

    // Validate and convert ID
    let userId;
    try {
      userId = new mongoose.Types.ObjectId(decoded.id);
    } catch (err) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid user ID format in token' 
      });
    }

    // Check both collections with proper error handling
    let user, adminUser;
    try {
      [user, adminUser] = await Promise.all([
        User.findById(userId).select('-password').lean().exec(),
        Admin.findById(userId).select('-password').lean().exec()
      ]);
    } catch (dbError) {
      console.error('Database lookup error:', dbError);
      return res.status(500).json({ 
        success: false,
        message: 'Error verifying user identity' 
      });
    }

    // Determine authenticated user
    const authenticatedUser = adminUser || user;
    if (!authenticatedUser) {
      return res.status(401).json({ 
        success: false,
        message: 'User account not found' 
      });
    }

    // Attach user to request with proper typing
    req.user = {
      ...authenticatedUser,
      _id: userId,
      isAdmin: !!adminUser
    };

    // Proceed to next middleware
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);

    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Session expired. Please log in again.',
        code: 'TOKEN_EXPIRED'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid authentication token',
        code: 'INVALID_TOKEN'
      });
    }

    // Handle unexpected errors
    res.status(500).json({ 
      success: false,
      message: 'Authentication processing failed',
      code: 'AUTH_FAILURE'
    });
  }
});

const admin = (req, res, next) => {
  // First verify the protect middleware ran successfully
  if (!req.user) {
    return res.status(403).json({ 
      success: false,
      message: 'Request not properly authenticated',
      code: 'MISSING_AUTH'
    });
  }

  // Then check admin status
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Administrator privileges required',
      code: 'ADMIN_REQUIRED',
      user: {
        id: req.user._id,
        role: req.user.isAdmin ? 'admin' : 'user'
      }
    });
  }
};

module.exports = { protect, admin };