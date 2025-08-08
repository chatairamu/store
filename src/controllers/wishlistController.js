// src/controllers/wishlistController.js
// Controller for managing user wishlists.

const Wishlist = require('../models/Wishlist');

/**
 * Get all items in the user's wishlist.
 * @route GET /api/wishlist
 * @access Protected
 */
exports.getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const wishlistItems = await Wishlist.findByUserId(userId);
        res.status(200).json(wishlistItems);
    } catch (error) {
        console.error('Get Wishlist Error:', error);
        res.status(500).json({ message: 'Server error while fetching wishlist.' });
    }
};

/**
 * Add a product to the user's wishlist.
 * @route POST /api/wishlist/:productId
 * @access Protected
 */
exports.addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        await Wishlist.add(userId, productId);

        res.status(201).json({ message: 'Product added to wishlist successfully.' });
    } catch (error) {
        console.error('Add to Wishlist Error:', error);
        res.status(500).json({ message: 'Server error while adding to wishlist.' });
    }
};

/**
 * Remove a product from the user's wishlist.
 * @route DELETE /api/wishlist/:productId
 * @access Protected
 */
exports.removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        await Wishlist.remove(userId, productId);

        res.status(200).json({ message: 'Product removed from wishlist successfully.' });
    } catch (error) {
        console.error('Remove from Wishlist Error:', error);
        res.status(500).json({ message: 'Server error while removing from wishlist.' });
    }
};
