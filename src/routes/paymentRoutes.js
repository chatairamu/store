// src/routes/paymentRoutes.js
// Routes for handling payments.

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Protect all payment routes
router.use(protect);

// @route   POST /api/payments/create-order
// @desc    Create a Razorpay order to initiate payment
// @access  Protected
router.post('/create-order', paymentController.createRazorpayOrder);

// @route   POST /api/payments/verify
// @desc    Verify the payment and create the order in our DB
// @access  Protected
router.post('/verify', paymentController.verifyPayment);

module.exports = router;
