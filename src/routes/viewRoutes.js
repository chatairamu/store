// src/routes/viewRoutes.js
// Routes for rendering the EJS pages.

const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// Products page
router.get('/products', (req, res) => {
  res.render('products', { title: 'Products' });
});

// Cart page
router.get('/cart', (req, res) => {
  res.render('cart', { title: 'Cart' });
});

// Account page
router.get('/account', (req, res) => {
  // This should be a protected route in a real app
  res.render('account', { title: 'My Account' });
});

// Login page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// Register page
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

module.exports = router;
