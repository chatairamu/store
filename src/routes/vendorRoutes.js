// src/routes/vendorRoutes.js
// Routes for the vendor dashboard and management.

const express = require('express');
const router = express.Router();
const { protect, isVendor } = require('../middleware/authMiddleware');
const { validateToken } = require('../middleware/csrfMiddleware');
const upload = require('../middleware/uploadMiddleware');
const vendorController = require('../controllers/vendorController');

// Apply the 'protect' and 'isVendor' middleware to all routes in this file.
router.use(protect, isVendor);

// --- View Routes ---
router.get('/dashboard', vendorController.getDashboard);
router.get('/products/add', vendorController.getAddProductPage);
router.get('/products', vendorController.getProductsPage);
router.get('/products/edit/:id', vendorController.getEditProductPage);
router.get('/orders', vendorController.getOrdersPage);

// --- Action Routes (with CSRF protection) ---
router.post('/products', upload.single('product_image'), validateToken, vendorController.createProduct);
router.post('/products/edit/:id', upload.single('product_image'), validateToken, vendorController.updateProduct);
router.delete('/products/:id', validateToken, vendorController.deleteProduct);
router.post('/orders/:orderId/status', validateToken, vendorController.updateOrderStatus);

module.exports = router;
