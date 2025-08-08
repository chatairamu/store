// src/controllers/adminController.js
// Controller for rendering admin dashboard pages and reports.

const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Order = require('../models/Order');

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
