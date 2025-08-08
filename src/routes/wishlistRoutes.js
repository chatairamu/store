// src/routes/wishlistRoutes.js
// Routes for handling user wishlist functionality.

const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');
const { validateToken } = require('../middleware/csrfMiddleware');

// Protect all wishlist routes
router.use(protect);

// GET route doesn't need CSRF validation
router.get('/', wishlistController.getWishlist);

// State-changing routes need CSRF validation
router.post('/:productId', validateToken, wishlistController.addToWishlist);
router.delete('/:productId', validateToken, wishlistController.removeFromWishlist);

module.exports = router;
