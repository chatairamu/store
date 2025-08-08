// src/routes/deliveryApiRoutes.js
// API routes for delivery partners.

const express = require('express');
const router = express.Router();
const deliveryPartnerController = require('../controllers/deliveryPartnerController');
const { protect, isDeliveryPartner } = require('../middleware/authMiddleware');

// Protect all routes in this file
router.use(protect, isDeliveryPartner);

// @route   POST /api/delivery/location
// @desc    Update the delivery partner's current location
// @access  Protected/DeliveryPartner
router.post('/location', deliveryPartnerController.updateLocation);

module.exports = router;
