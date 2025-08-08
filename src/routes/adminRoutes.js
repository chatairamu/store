// src/routes/adminRoutes.js
// Routes for the admin dashboard and management.

const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { validateToken } = require('../middleware/csrfMiddleware');
const adminController = require('../controllers/adminController');

// Protect all routes in this file with both protect and isAdmin middleware
router.use(protect, isAdmin);

// --- View Routes ---
router.get('/dashboard', adminController.getDashboardPage);
router.get('/users', adminController.getUsersPage);
router.get('/vendors', adminController.getVendorsPage);
router.get('/orders', adminController.getOrdersPage);
router.get('/reviews', adminController.getReviewsPage);
router.get('/tags', adminController.getTagsPage);
router.get('/settings/delivery', adminController.getDeliverySettingsPage);
router.get('/settings/festivals', adminController.getFestivalSurchargesPage);

// --- Action Routes (with CSRF protection) ---
router.post('/vendors/:vendorId/status', validateToken, adminController.updateVendorStatus);
router.post('/reviews/:reviewId/status', validateToken, adminController.updateReviewStatus);
router.post('/tags', validateToken, adminController.createTag);
router.post('/settings/delivery', validateToken, adminController.updateDeliverySettings);
router.post('/settings/festivals', validateToken, adminController.addFestivalSurcharge);

module.exports = router;
