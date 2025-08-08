// src/controllers/reviewController.js
// Controller for handling review submissions and retrieval.

const Review = require('../models/Review');

/**
 * Get all approved reviews for a specific product.
 * @route GET /api/reviews/:productId
 */
exports.getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.findByProductId(productId);
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Get Product Reviews Error:', error);
        res.status(500).json({ message: 'Server error while fetching reviews.' });
    }
};

/**
 * Create a new review for a product.
 * @route POST /api/reviews/:productId
 * @access Protected
 */
exports.createProductReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id; // From 'protect' middleware

        if (!rating) {
            return res.status(400).json({ message: 'A rating is required.' });
        }

        // Optional: Check if the user has purchased the product before allowing a review.
        // This would require more complex logic checking the user's order history.

        const reviewData = {
            user_id: userId,
            product_id: productId,
            rating: rating,
            comment: comment || ''
        };

        await Review.create(reviewData);

        res.status(201).json({ message: 'Review submitted successfully! It will be visible after moderation.' });

    } catch (error) {
        console.error('Create Review Error:', error);
        res.status(500).json({ message: 'Server error while submitting review.' });
    }
};
