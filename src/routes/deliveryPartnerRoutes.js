// src/routes/deliveryPartnerRoutes.js
// Routes for the delivery partner dashboard.

const express = require('express');
const router = express.Router();
const { protect, isDeliveryPartner } = require('../middleware/authMiddleware');

const deliveryPartnerController = require('../controllers/deliveryPartnerController');

// Protect all routes in this file
router.use(protect, isDeliveryPartner);

// @route   GET /delivery/dashboard
// @desc    Get the main dashboard page for the delivery partner
// @access  Protected/DeliveryPartner
router.get('/dashboard', deliveryPartnerController.getDashboardPage);

// @route   GET /delivery/orders
// @desc    Get the assigned orders page for the delivery partner
// @access  Protected/DeliveryPartner
router.get('/orders', deliveryPartnerController.getOrdersPage);

// @route   POST /delivery/orders/:orderId/status
// @desc    Update the status of an assigned order
// @access  Protected/DeliveryPartner
router.post('/orders/:orderId/status', deliveryPartnerController.updateOrderStatus);

module.exports = router;
