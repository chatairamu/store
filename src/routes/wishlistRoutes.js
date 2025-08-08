// src/routes/wishlistRoutes.js
// Routes for handling user wishlist functionality.

const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

// Protect all wishlist routes
router.use(protect);

// @route   GET /api/wishlist
// @desc    Get all items from the user's wishlist
// @access  Protected
router.get('/', wishlistController.getWishlist);

// @route   POST /api/wishlist/:productId
// @desc    Add a product to the user's wishlist
// @access  Protected
router.post('/:productId', wishlistController.addToWishlist);

// @route   DELETE /api/wishlist/:productId
// @desc    Remove a product from the user's wishlist
// @access  Protected
router.delete('/:productId', wishlistController.removeFromWishlist);

module.exports = router;
