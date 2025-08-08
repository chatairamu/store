// src/controllers/adminController.js
// Controller for rendering admin dashboard pages and reports.

const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Order = require('../models/Order');
const Review = require('../models/Review');

/**
 * Renders the main admin dashboard with summary stats.
 * @route GET /admin/dashboard
 */
exports.getDashboardPage = async (req, res) => {
  try {
    const [users, vendors, orders] = await Promise.all([
      User.findAll(),
      Vendor.findAll(),
      Order.findAll()
    ]);

    // In a real app, revenue would be calculated properly
    const totalRevenue = orders.reduce((sum, order) => sum + order.order_total, 0);

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      userCount: users.length,
      vendorCount: vendors.length,
      orderCount: orders.length,
      totalRevenue: totalRevenue
    });
  } catch (error) {
    console.error('Admin Dashboard Error:', error);
    res.status(500).send('Server Error');
  }
};

/**
 * Renders the review moderation page.
 * @route GET /admin/reviews
 */
exports.getReviewsPage = async (req, res) => {
    try {
        const reviews = await Review.findAllPending();
        res.render('admin/reviews', {
            title: 'Review Moderation',
            reviews
        });
    } catch (error) {
        console.error('Get Reviews Page Error:', error);
        res.status(500).send('Server Error');
    }
};

/**
 * Handles updating a review's status (approval/rejection).
 * @route POST /admin/reviews/:id/status
 */
exports.updateReviewStatus = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { status } = req.body;
        await Review.updateStatus(reviewId, status);
        res.redirect('/admin/reviews');
    } catch (error) {
        console.error('Update Review Status Error:', error);
        res.status(500).send('Server Error');
    }
};

/**
 * Renders the festival surcharges page.
 * @route GET /admin/settings/festivals
 */
exports.getFestivalSurchargesPage = async (req, res) => {
    try {
        const FestivalSurcharge = require('../models/FestivalSurcharge');
        const surcharges = await FestivalSurcharge.findAll();
        res.render('admin/festivalSurcharges', {
            title: 'Festival Surcharges',
            surcharges
        });
    } catch (error) {
        console.error('Get Festival Surcharges Error:', error);
        res.status(500).send('Server Error');
    }
};

/**
 * Handles adding a new festival surcharge.
 * @route POST /admin/settings/festivals
 */
exports.addFestivalSurcharge = async (req, res) => {
    try {
        const { festival_name, charge_percentage, start_date, end_date } = req.body;
        const sql = 'INSERT INTO festival_surcharges (festival_name, charge_percentage, start_date, end_date) VALUES (?, ?, ?, ?)';
        const pool = require('../config/db');
        await pool.execute(sql, [festival_name, charge_percentage, start_date, end_date]);
        res.redirect('/admin/settings/festivals');
    } catch (error) {
        console.error('Add Festival Surcharge Error:', error);
        res.status(500).send('Server Error');
    }
};

/**
 * Renders the delivery settings page.
 * @route GET /admin/settings/delivery
 */
exports.getDeliverySettingsPage = async (req, res) => {
    try {
        const Settings = require('../models/Settings');
        const settings = await Settings.getAllDeliverySettings();
        res.render('admin/deliverySettings', {
            title: 'Delivery Settings',
            settings
        });
    } catch (error) {
        console.error('Get Delivery Settings Error:', error);
        res.status(500).send('Server Error');
    }
};

/**
 * Handles updating the delivery settings.
 * @route POST /admin/settings/delivery
 */
exports.updateDeliverySettings = async (req, res) => {
    try {
        const Settings = require('../models/Settings');
        // We can pass the req.body directly if the form names match the setting_key
        await Settings.updateDeliverySettings(req.body);
        res.redirect('/admin/settings/delivery');
    } catch (error) {
        console.error('Update Delivery Settings Error:', error);
        res.status(500).send('Server Error');
    }
};

/**
 * Handles updating a vendor's status (approval/rejection).
 * @route POST /admin/vendors/:id/status
 */
exports.updateVendorStatus = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { status } = req.body;

    await Vendor.updateStatus(vendorId, status);
    res.redirect('/admin/vendors');

  } catch (error) {
    console.error('Update Vendor Status Error:', error);
    res.status(500).send('Server Error');
  }
};

/**
 * Renders the user management page.
 * @route GET /admin/users
 */
exports.getUsersPage = async (req, res) => {
  try {
    const users = await User.findAll();
    res.render('admin/users', {
      title: 'User Management',
      users: users
    });
  } catch (error) {
    console.error('Admin Users Page Error:', error);
    res.status(500).send('Server Error');
  }
};

/**
 * Renders the vendor management page.
 * @route GET /admin/vendors
 */
exports.getVendorsPage = async (req, res) => {
  try {
    const vendors = await Vendor.findAll();
    res.render('admin/vendors', {
      title: 'Vendor Management',
      vendors: vendors
    });
  } catch (error) {
    console.error('Admin Vendors Page Error:', error);
    res.status(500).send('Server Error');
  }
};

/**
 * Renders the order management page.
 * @route GET /admin/orders
 */
exports.getOrdersPage = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.render('admin/orders', {
      title: 'Order Management',
      orders: orders
    });
  } catch (error) {
    console.error('Admin Orders Page Error:', error);
    res.status(500).send('Server Error');
  }
};
