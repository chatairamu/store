// src/routes/productRoutes.js
// Routes for handling product-related API requests.

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', productController.getAllProducts);

// @route   GET /api/products/:id
// @desc    Get a single product by ID
// @access  Public
router.get('/:id', productController.getProductById);

// @route   POST /api/products
// @desc    Create a new product
// @access  Protected (Vendor/Admin only)
router.post('/', protect, productController.createProduct);

// Note: In a real application, you would also have PUT and DELETE routes.
// router.put('/:id', protect, admin, productController.updateProduct);
// router.delete('/:id', protect, admin, productController.deleteProduct);

module.exports = router;
