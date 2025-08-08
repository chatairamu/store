// src/routes/couponRoutes.js
// Routes for handling coupon application.

const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { protect } = require('../middleware/authMiddleware');

// All routes in this file are protected.
router.use(protect);

// @route   POST /api/coupons/apply
// @desc    Apply a coupon to the user's cart
// @access  Protected
router.post('/apply', couponController.applyCoupon);

module.exports = router;
