// src/controllers/orderController.js
// Controller for handling order creation and retrieval.

const Order = require('../models/Order');
const Cart = require('../models/Cart'); // Needed to get cart contents for order creation

/**
 * Create a new order from the user's cart.
 * @route POST /api/orders
 * @access Protected
 */
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address_id, payment_method, delivery_type } = req.body;

    // Basic validation
    if (!address_id || !payment_method || !delivery_type) {
      return res.status(400).json({ message: 'Please provide address, payment method, and delivery type.' });
    }

    // 1. Get the user's cart to calculate totals and get items
    const cart = await Cart.findOrCreateByUserId(userId);
    const items = await Cart.getCartItems(cart.id);

    if (items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty.' });
    }

    // This assumes all items in the cart are from the same vendor.
    // A real multi-vendor cart would be more complex.
    const [firstItem] = await pool.execute('SELECT vendor_id FROM products WHERE id = ?', [items[0].product_id]);
    const vendor_id = firstItem[0].vendor_id;

    // 2. Calculate totals (this is a simplified calculation)
    const sub_total = items.reduce((acc, item) => acc + (item.sale_price * item.quantity), 0);
    const delivery_charge = 50.00; // Placeholder
    const packaging_charge = items.length * 10.00; // Placeholder
    const gst_total = sub_total * 0.18; // Placeholder for 18% GST
    const order_total = sub_total + delivery_charge + packaging_charge + gst_total;

    // 3. Prepare order data
    const orderData = {
      vendor_id,
      address_id,
      sub_total,
      delivery_charge,
      packaging_charge,
      gst_total,
      order_total,
      payment_method,
      delivery_type
    };

    // 4. Create the order using the model's transactional method
    const newOrderId = await Order.create(userId, orderData);

    res.status(201).json({
      message: 'Order placed successfully!',
      orderId: newOrderId,
    });

  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ message: 'Server error while placing the order.' });
  }
};

/**
 * Get all orders for the logged-in user.
 * @route GET /api/orders
 * @access Protected
 */
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findByUserId(req.user.id);
    res.status(200).json(orders);
  } catch (error) {
    console.error('Get User Orders Error:', error);
    res.status(500).json({ message: 'Server error while fetching orders.' });
  }
};

/**
 * Get a single order by ID.
 * @route GET /api/orders/:id
 * @access Protected
 */
exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    // Security check: ensure the order belongs to the user requesting it
    if (order && order.user_id === req.user.id) {
      res.status(200).json(order);
    } else if (!order) {
      res.status(404).json({ message: 'Order not found.' });
    } else {
      // If the order exists but doesn't belong to the user
      res.status(403).json({ message: 'Not authorized to view this order.' });
    }
  } catch (error) {
    console.error('Get Order Details Error:', error);
    res.status(500).json({ message: 'Server error while fetching order details.' });
  }
};
