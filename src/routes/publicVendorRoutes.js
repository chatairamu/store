// src/routes/publicVendorRoutes.js
// Publicly accessible routes for vendor information.

const express = require('express');
const router = express.Router();
const publicVendorController = require('../controllers/publicVendorController');

// @route   GET /api/public/vendors/:id/settings
// @desc    Get public settings for a vendor
// @access  Public
router.get('/:id/settings', publicVendorController.getVendorPublicSettings);

module.exports = router;
