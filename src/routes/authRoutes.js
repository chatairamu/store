// src/routes/authRoutes.js
// Routes for user and vendor authentication.

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateToken } = require('../middleware/csrfMiddleware');

// --- User Authentication Routes ---
// @route   POST /api/auth/user/register
// @desc    Register a new user
// @access  Public
router.post('/user/register', validateToken, authController.registerUser);

// @route   POST /api/auth/user/login
// @desc    Login a user and get a token
// @access  Public
router.post('/user/login', validateToken, authController.loginUser);


// --- Vendor Authentication Routes ---
// @route   POST /api/auth/vendor/register
// @desc    Register a new vendor
// @access  Public
router.post('/vendor/register', authController.registerVendor);

// @route   POST /api/auth/vendor/login
// @desc    Login a vendor and get a token
// @access  Public
router.post('/vendor/login', authController.loginVendor);


// --- Delivery Partner Authentication Routes ---
// @route   POST /api/auth/delivery-partner/login
// @desc    Login a delivery partner and get a token
// @access  Public
router.post('/delivery-partner/login', authController.loginDeliveryPartner);


module.exports = router;
