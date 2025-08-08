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

    const { earnings, count } = await DeliveryPartner.calculateEarnings(partnerId);

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
 * Handles a location update from a delivery partner.
 * @route POST /api/delivery/location
 */
exports.updateLocation = async (req, res) => {
    try {
        const { lat, lng } = req.body;
        const partnerId = req.partner.id;

        if (lat === undefined || lng === undefined) {
            return res.status(400).json({ message: 'Latitude and longitude are required.' });
        }

        await DeliveryPartner.updateLocation(partnerId, lat, lng);
        res.status(200).json({ message: 'Location updated successfully.' });

    } catch (error) {
        console.error('Update Location Error:', error);
        res.status(500).json({ message: 'Server error while updating location.' });
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
