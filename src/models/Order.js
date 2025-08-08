// src/models/Order.js
// The Order model for managing order data.

const pool = require('../config/db');

const Order = {
  /**
   * Creates a new order by moving items from the cart.
   * This function uses a transaction to ensure data integrity.
   * @param {number} userId - The ID of the user placing the order.
   * @param {object} orderData - Data for the order.
   * @returns {Promise<number>} The ID of the newly created order.
   */
  async create(userId, orderData) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const {
        vendor_id,
        address_id,
        sub_total,
        delivery_charge,
        packaging_charge,
        gst_total,
        order_total,
        payment_method,
        delivery_type
      } = orderData;

      // 1. Get user's cart
      const [carts] = await connection.execute('SELECT id FROM cart WHERE user_id = ?', [userId]);
      if (carts.length === 0) {
        throw new Error('User has no active cart.');
      }
      const cartId = carts[0].id;

      // 2. Get cart items
      const [cartItems] = await connection.execute('SELECT * FROM cart_items WHERE cart_id = ?', [cartId]);
      if (cartItems.length === 0) {
        throw new Error('Cannot create an order with an empty cart.');
      }

      // 3. Create the order in the 'orders' table
      const orderSql = `
        INSERT INTO orders
        (user_id, vendor_id, address_id, sub_total, delivery_charge, packaging_charge, gst_total, order_total, payment_method, delivery_type, payment_status, order_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'Pending')
      `;
      const [orderResult] = await connection.execute(orderSql, [
        userId, vendor_id, address_id, sub_total, delivery_charge, packaging_charge, gst_total, order_total, payment_method, delivery_type
      ]);
      const orderId = orderResult.insertId;

      // 4. Move items from cart_items to order_items
      const orderItemSql = 'INSERT INTO order_items (order_id, product_id, quantity, price, gst_percentage, gst_amount, total_price) VALUES ?';
      const orderItemValues = await Promise.all(cartItems.map(async (item) => {
        // In a real app, you'd get the actual GST slab from the product
        const [product] = await connection.execute('SELECT gst_slab_id FROM products WHERE id = ?', [item.product_id]);
        const gst_slab_id = product[0].gst_slab_id;
        // This is a simplified calculation
        const gst_percentage = 18.00; // Placeholder
        const gst_amount = item.price * (gst_percentage / 100);
        const total_price = item.price + gst_amount;
        return [orderId, item.product_id, item.quantity, item.price, gst_percentage, gst_amount, total_price];
      }));

      await connection.query(orderItemSql, [orderItemValues]);

      // 5. Clear the cart_items
      await connection.execute('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);

      // If everything is successful, commit the transaction
      await connection.commit();

      return orderId;

    } catch (error) {
      // If any step fails, roll back the transaction
      await connection.rollback();
      console.error('Order Creation Transaction Error:', error);
      throw error; // Re-throw the error to be handled by the controller
    } finally {
      // Always release the connection back to the pool
      connection.release();
    }
  },

  /**
   * Finds all orders for a specific user.
   * @param {number} userId - The user's ID.
   * @returns {Promise<Array>} An array of order objects.
   */
  async findByUserId(userId) {
    const sql = `
      SELECT o.*, v.name as vendor_name
      FROM orders o
      JOIN vendors v ON o.vendor_id = v.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `;
    const [rows] = await pool.execute(sql, [userId]);
    return rows;
  },

  /**
   * Finds a single order by its ID, including its items.
   * @param {number} orderId - The order's ID.
   * @returns {Promise<object|null>} The order object with items, or null if not found.
   */
  async findById(orderId) {
    const orderSql = 'SELECT * FROM orders WHERE id = ?';
    const [orderRows] = await pool.execute(orderSql, [orderId]);
    if (!orderRows[0]) return null;

    const itemsSql = `
      SELECT oi.*, p.name as product_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `;
    const [itemRows] = await pool.execute(itemsSql, [orderId]);

    const order = orderRows[0];
    order.items = itemRows;

    return order;
  }
};

module.exports = Order;
