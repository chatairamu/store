// src/routes/cartRoutes.js
// Routes for handling shopping cart functionality.

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const { validateToken } = require('../middleware/csrfMiddleware');

// All routes in this file are protected and require a logged-in user.
router.use(protect);

// GET route doesn't need CSRF validation
router.get('/', cartController.getCart);

// State-changing routes need CSRF validation
router.post('/', validateToken, cartController.addToCart);
router.put('/:itemId', validateToken, cartController.updateCartItem);
router.delete('/:itemId', validateToken, cartController.removeFromCart);

module.exports = router;
