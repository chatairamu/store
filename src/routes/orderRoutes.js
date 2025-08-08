// src/routes/orderRoutes.js
// Routes for handling order management.

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// All routes in this file are protected.
router.use(protect);

// @route   POST /api/orders
// @desc    Create a new order
// @access  Protected
router.post('/', orderController.createOrder);

// @route   GET /api/orders
// @desc    Get all orders for the logged-in user
// @access  Protected
router.get('/', orderController.getUserOrders);

// @route   GET /api/orders/:id
// @desc    Get a single order by its ID
// @access  Protected
router.get('/:id', orderController.getOrderDetails);

// @route   GET /api/orders/:orderId/location
// @desc    Get the location of the delivery partner for an order
// @access  Protected
router.get('/:orderId/location', orderController.getOrderLocation);

module.exports = router;
