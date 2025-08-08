// src/models/DeliveryPartner.js
// The DeliveryPartner model for interacting with the 'delivery_partners' table.

const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const DeliveryPartner = {
  /**
   * Finds a delivery partner by their email address.
   * @param {string} email - The email to search for.
   * @returns {Promise<object|null>} The delivery partner object if found, otherwise null.
   */
  async findByEmail(email) {
    const sql = 'SELECT * FROM delivery_partners WHERE email = ?';
    const [rows] = await pool.execute(sql, [email]);
    return rows[0] || null;
  },

  /**
   * Finds a delivery partner by their ID.
   * @param {number} id - The ID of the delivery partner to find.
   * @returns {Promise<object|null>} The delivery partner object if found, otherwise null.
   */
  async findById(id) {
    // Exclude password from the result for security
    const sql = 'SELECT id, name, email, phone, status, created_at FROM delivery_partners WHERE id = ?';
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
  },

  /**
   * Compares a candidate password with the delivery partner's stored hashed password.
   * @param {string} candidatePassword - The plain text password to compare.
   * @param {string} hashedPassword - The hashed password from the database.
   * @returns {Promise<boolean>} True if the passwords match, otherwise false.
   */
  async comparePasswords(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
};

  /**
   * Calculates the total earnings for a delivery partner.
   * @param {number} partnerId - The delivery partner's ID.
   * @param {number} feePerDelivery - The flat fee earned per delivery.
   * @returns {Promise<{earnings: number, count: number}>} The total earnings and count of completed deliveries.
   */
  async calculateEarnings(partnerId, feePerDelivery) {
    const sql = `
      SELECT COUNT(o.id) as completedDeliveries
      FROM orders o
      JOIN order_delivery od ON o.id = od.order_id
      WHERE od.delivery_partner_id = ? AND o.order_status = 'Delivered'
    `;
    const [result] = await pool.execute(sql, [partnerId]);
    const count = result[0].completedDeliveries || 0;
    const earnings = count * feePerDelivery;
    return { earnings, count };
  }
};

module.exports = DeliveryPartner;
