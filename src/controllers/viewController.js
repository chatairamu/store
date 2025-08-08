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
  res.render('account', { title: 'My Account' });
};

exports.getLoginPage = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.getRegisterPage = (req, res) => {
  res.render('register', { title: 'Register' });
};
