// src/controllers/viewController.js
// Controller for rendering EJS pages.

exports.getHomePage = (req, res) => {
  res.render('index', { title: 'Home' });
};

exports.getProductsPage = (req, res) => {
  res.render('products', { title: 'Products' });
};

exports.getCartPage = (req, res) => {
  res.render('cart', { title: 'Cart' });
};

exports.getCheckoutPage = (req, res) => {
    res.render('checkout', { title: 'Checkout' });
};

exports.getAccountPage = (req, res) => {
  res.render('account', {
    title: 'My Account',
    user: req.user,
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
  });
};

exports.getLoginPage = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.getRegisterPage = (req, res) => {
  res.render('register', { title: 'Register' });
};

const Product = require('../models/Product');
const Review = require('../models/Review');

exports.getProductDetailPage = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).render('404'); // Assuming a 404 view exists
        }

        const reviews = await Review.findByProductId(productId);

        let averageRating = 0;
        if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            averageRating = totalRating / reviews.length;
        }

        res.render('product-detail', {
            title: product.name,
            product,
            reviews,
            averageRating,
            user: req.user // Pass user to check if logged in
        });

    } catch (error) {
        console.error('Get Product Detail Page Error:', error);
        res.status(500).send('Server Error');
    }
};
