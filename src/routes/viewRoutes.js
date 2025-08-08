// src/routes/viewRoutes.js
// Routes for rendering the EJS pages.

const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');
const { protect } = require('../middleware/authMiddleware'); // To protect account/checkout pages

// Home page
router.get('/', viewController.getHomePage);

// Products page
router.get('/products', viewController.getProductsPage);

// Single Product Detail page
router.get('/product/:id', viewController.getProductDetailPage);

// Cart page
router.get('/cart', viewController.getCartPage);

// Login & Register pages
router.get('/login', viewController.getLoginPage);
router.get('/register', viewController.getRegisterPage);

// --- Protected View Routes ---
// The following routes require a user to be logged in.
router.get('/account', protect, viewController.getAccountPage);
router.get('/checkout', protect, viewController.getCheckoutPage);


module.exports = router;
