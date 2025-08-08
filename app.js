// app.js - Main application file

// Import required packages
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();

// Set the port from environment variables or default to 3000
const PORT = process.env.PORT || 3000;

// --- Middleware ---
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// --- View Engine Setup ---
// Set EJS as the view engine
app.set('view engine', 'ejs');
// Set the views directory
app.set('views', path.join(__dirname, 'views'));


// --- Routes ---
// Import route files
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const couponRoutes = require('./src/routes/couponRoutes');
const viewRoutes = require('./src/routes/viewRoutes');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);

// View & Page Routes
const vendorRoutes = require('./src/routes/vendorRoutes');
const deliveryPartnerRoutes = require('./src/routes/deliveryPartnerRoutes');
app.use('/vendor', vendorRoutes);
app.use('/delivery', deliveryPartnerRoutes);
app.use('/', viewRoutes); // This should be last as a catch-all for pages

// --- Server Startup ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app; // Export for potential testing
