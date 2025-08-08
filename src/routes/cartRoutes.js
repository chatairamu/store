// src/routes/cartRoutes.js
// Routes for handling shopping cart functionality.

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// All routes in this file are protected and require a logged-in user.
router.use(protect);

// @route   GET /api/cart
// @desc    Get the user's cart
// @access  Protected
router.get('/', cartController.getCart);

// @route   POST /api/cart
// @desc    Add an item to the cart
// @access  Protected
router.post('/', cartController.addToCart);

// @route   PUT /api/cart/:itemId
// @desc    Update the quantity of a cart item
// @access  Protected
router.put('/:itemId', cartController.updateCartItem);

// @route   DELETE /api/cart/:itemId
// @desc    Remove an item from the cart
// @access  Protected
router.delete('/:itemId', cartController.removeFromCart);

module.exports = router;
