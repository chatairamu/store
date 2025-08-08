// src/routes/reviewRoutes.js
// Routes for handling product reviews.

const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/reviews/:productId
// @desc    Get all approved reviews for a product
// @access  Public
router.get('/:productId', reviewController.getProductReviews);

// @route   POST /api/reviews/:productId
// @desc    Create a new review for a product
// @access  Protected
router.post('/:productId', protect, reviewController.createProductReview);

module.exports = router;
