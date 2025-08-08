// src/routes/vendorRoutes.js
// Routes for the vendor dashboard and management.

const express = require('express');
const router = express.Router();
const { protect, isVendor } = require('../middleware/authMiddleware');

const vendorController = require('../controllers/vendorController');

// Apply the 'protect' and 'isVendor' middleware to all routes in this file.
router.use(protect, isVendor);

// @route   GET /vendor/dashboard
// @desc    Get the main dashboard page for the vendor
// @access  Protected/Vendor
router.get('/dashboard', vendorController.getDashboard);

// @route   GET /vendor/products/add
// @desc    Display the form to add a new product
// @access  Protected/Vendor
router.get('/products/add', vendorController.getAddProductPage);

// @route   GET /vendor/products
// @desc    Get the product management page for the vendor
// @access  Protected/Vendor
router.get('/products', vendorController.getProductsPage);

const upload = require('../middleware/uploadMiddleware');

// @route   POST /vendor/products
// @desc    Create a new product
// @access  Protected/Vendor
router.post('/products', upload.single('product_image'), vendorController.createProduct);

// @route   DELETE /vendor/products/:id
// @desc    Delete a product
// @access  Protected/Vendor
router.delete('/products/:id', vendorController.deleteProduct);

// @route   GET /vendor/products/edit/:id
// @desc    Display the form to edit a product
// @access  Protected/Vendor
router.get('/products/edit/:id', vendorController.getEditProductPage); // I will create this controller function next

// @route   POST /vendor/products/edit/:id
// @desc    Update a product
// @access  Protected/Vendor
router.post('/products/edit/:id', upload.single('product_image'), vendorController.updateProduct); // I will create this controller function next

// @route   GET /vendor/orders
// @desc    Get the order management page for the vendor
// @access  Protected/Vendor
router.get('/orders', vendorController.getOrdersPage);

// @route   POST /vendor/orders/:orderId/status
// @desc    Update the status of an order
// @access  Protected/Vendor
router.post('/orders/:orderId/status', vendorController.updateOrderStatus);


module.exports = router;
