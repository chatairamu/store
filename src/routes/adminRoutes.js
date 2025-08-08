// src/routes/adminRoutes.js
// Routes for the admin dashboard and management.

const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');

const adminController = require('../controllers/adminController');

// Protect all routes in this file with both protect and isAdmin middleware
router.use(protect, isAdmin);

// @route   GET /admin/dashboard
// @desc    Get the main dashboard page for the admin
// @access  Admin
router.get('/dashboard', adminController.getDashboardPage);

// @route   GET /admin/users
// @desc    Get the user management page
// @access  Admin
router.get('/users', adminController.getUsersPage);

// @route   GET /admin/vendors
// @desc    Get the vendor management page
// @access  Admin
router.get('/vendors', adminController.getVendorsPage);

// @route   POST /admin/vendors/:vendorId/status
// @desc    Update a vendor's status
// @access  Admin
router.post('/vendors/:vendorId/status', adminController.updateVendorStatus);

// @route   GET /admin/orders
// @desc    Get the order management page
// @access  Admin
router.get('/orders', adminController.getOrdersPage);

// @route   GET /admin/settings/delivery
// @desc    Get the delivery earnings settings page
// @access  Admin
router.get('/settings/delivery', adminController.getDeliverySettingsPage);

// @route   POST /admin/settings/delivery
// @desc    Update the delivery earnings settings
// @access  Admin
router.post('/settings/delivery', adminController.updateDeliverySettings);

// @route   GET /admin/settings/festivals
// @desc    Get the festival surcharges page
// @access  Admin
router.get('/settings/festivals', adminController.getFestivalSurchargesPage);

// @route   POST /admin/settings/festivals
// @desc    Add a new festival surcharge
// @access  Admin
router.post('/settings/festivals', adminController.addFestivalSurcharge);

// @route   GET /admin/reviews
// @desc    Get the review moderation page
// @access  Admin
router.get('/reviews', adminController.getReviewsPage);

// @route   POST /admin/reviews/:reviewId/status
// @desc    Update a review's status
// @access  Admin
router.post('/reviews/:reviewId/status', adminController.updateReviewStatus);


module.exports = router;
