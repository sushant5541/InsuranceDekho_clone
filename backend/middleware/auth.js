const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Admin = require('../models/Admin');

const protect = asyncHandler(async (req, res, next) => {
  // Enhanced header validation
  if (!req.headers.authorization) {
    return res.status(401).json({ 
      success: false,
      message: 'Authorization header missing' 
    });
  }

  const authHeader = req.headers.authorization;
  const tokenParts = authHeader.split(' ');
  
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ 
      success: false,
      message: 'Invalid authorization format' 
    });
  }

  const token = tokenParts[1];
  
  if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
    return res.status(401).json({ 
      success: false,
      message: 'Invalid token format' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded?.id) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token payload' 
      });
    }

    const userId = new mongoose.Types.ObjectId(decoded.id);

    // Check both collections with error handling
    let user, adminUser;
    try {
      [user, adminUser] = await Promise.all([
        User.findById(userId).select('-password').lean(),
        Admin.findById(userId).select('-password').lean()
      ]);
    } catch (dbError) {
      console.error('Database lookup error:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Error verifying user'
      });
    }

    const authenticatedUser = adminUser || user;
    
    if (!authenticatedUser) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Enhanced user object attachment
    req.user = {
      ...authenticatedUser,
      _id: userId,
      isAdmin: !!adminUser
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    let errorMessage = 'Authentication failed';
    if (error.name === 'TokenExpiredError') {
      errorMessage = 'Token expired';
    } else if (error.name === 'JsonWebTokenError') {
      errorMessage = 'Invalid token';
    }

    res.status(401).json({ 
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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