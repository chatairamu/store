// src/middleware/authMiddleware.js
// Middleware to protect routes by verifying JWT.

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Protects routes by checking for a valid JWT in the Authorization header.
 * If valid, it attaches the user or vendor object to the request.
 */
const protect = async (req, res, next) => {
  let token;

  // Check for the token in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user, vendor, or partner to the request object based on token payload
      if (decoded.userType === 'user') {
        req.user = await User.findById(decoded.id);
      } else if (decoded.userType === 'vendor') {
        req.vendor = await Vendor.findById(decoded.id);
      } else if (decoded.userType === 'delivery_partner') {
        // Need to import DeliveryPartner model for this
        const DeliveryPartner = require('../models/DeliveryPartner');
        req.partner = await DeliveryPartner.findById(decoded.id);
      } else {
        // Handle unknown userType
        return res.status(401).json({ message: 'Not authorized, invalid token payload.' });
      }

      // If user/vendor/partner not found in DB
      if (!req.user && !req.vendor && !req.partner) {
        return res.status(401).json({ message: 'Not authorized, user not found.' });
      }

      next();
    } catch (error) {
      console.error('Authentication Error:', error);
      res.status(401).json({ message: 'Not authorized, token failed.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided.' });
  }
};

/**
 * Middleware to restrict access to admins/vendors only.
 * This is a placeholder for future functionality.
 */
const admin = (req, res, next) => {
    // Check if req.user is a vendor or an admin user
    if ((req.user && req.user.isAdmin) || req.vendor) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin or vendor.' });
    }
};


/**
 * Middleware to ensure the logged-in user is a vendor.
 * Should be used after the 'protect' middleware.
 */
const isVendor = (req, res, next) => {
  if (req.vendor) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Vendor authorization required.' });
    // Or redirect to a login page with an error message
    // res.redirect('/login?error=vendor_required');
  }
};

/**
 * Middleware to ensure the logged-in user is a delivery partner.
 * Should be used after the 'protect' middleware.
 */
const isDeliveryPartner = (req, res, next) => {
  if (req.partner) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Delivery partner authorization required.' });
  }
};

module.exports = { protect, admin, isVendor, isDeliveryPartner };
