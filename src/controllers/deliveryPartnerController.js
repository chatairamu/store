// src/controllers/deliveryPartnerController.js
// Controller for rendering delivery partner dashboard pages.

const Order = require('../models/Order');

/**
 * Renders the main delivery partner dashboard page.
 * @route GET /delivery/dashboard
 */
const DeliveryPartner = require('../models/DeliveryPartner');

exports.getDashboardPage = async (req, res) => {
  try {
    const partnerId = req.partner.id;
    const FEE_PER_DELIVERY = 30; // Placeholder fee, could be stored in config

    const { earnings, count } = await DeliveryPartner.calculateEarnings(partnerId, FEE_PER_DELIVERY);

    res.render('delivery-partner/dashboard', {
      title: 'Dashboard',
      partner: req.partner,
      totalEarnings: earnings,
      completedDeliveries: count
    });
  } catch (error) {
    console.error('Delivery Partner Dashboard Error:', error);
    res.status(500).send('Server Error');
  }
};

/**
 * Renders the delivery partner's assigned orders page.
 * @route GET /delivery/orders
 */
exports.getOrdersPage = async (req, res) => {
  try {
    const orders = await Order.findOrdersByDeliveryPartnerId(req.partner.id);
    res.render('delivery-partner/orders', {
      title: 'Assigned Orders',
      partner: req.partner,
      orders: orders
    });
  } catch (error) {
    console.error('Delivery Partner Orders Page Error:', error);
    res.status(500).send('Server Error');
  }
};

/**
 * Handles updating the status of an order by a delivery partner.
 * @route POST /delivery/orders/:id/status
 */
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const partnerId = req.partner.id;

        // Security check: Ensure the order is assigned to this delivery partner.
        const assignedOrders = await Order.findOrdersByDeliveryPartnerId(partnerId);
        const orderExistsForPartner = assignedOrders.some(order => order.id.toString() === orderId);

        if (!orderExistsForPartner) {
            return res.status(403).send('Not authorized to update this order.');
        }

        // Delivery partners should only be able to set specific statuses
        const allowedStatuses = ['Out for Delivery', 'Delivered', 'Cancelled'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).send('Invalid status update for delivery partner.');
        }

        await Order.updateStatus(orderId, status);
        res.redirect('/delivery/orders');

    } catch (error) {
        console.error('DP Update Order Status Error:', error);
        res.status(500).send('Server Error');
    }
};
