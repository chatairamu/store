// src/models/Coupon.js
// The Coupon model for managing coupon data and validation.

const pool = require('../config/db');

const Coupon = {
  /**
   * Finds a coupon by its code.
   * @param {string} code - The coupon code.
   * @returns {Promise<object|null>} The coupon object if found and active, otherwise null.
   */
  async findByCode(code) {
    const sql = `
      SELECT * FROM coupons
      WHERE code = ?
      AND status = 'active'
      AND start_date <= NOW()
      AND expiry_date >= NOW()
    `;
    const [rows] = await pool.execute(sql, [code]);
    return rows[0] || null;
  },

  /**
   * Validates a coupon against the cart total and usage limits.
   * @param {object} coupon - The coupon object from the database.
   * @param {number} cartTotal - The subtotal of the cart.
   * @param {number} userId - The ID of the user applying the coupon.
   * @returns {Promise<{isValid: boolean, message: string, discount: number}>} Validation result.
   */
  async validate(coupon, cartTotal, userId) {
    // Check minimum cart value
    if (coupon.min_cart_value && cartTotal < coupon.min_cart_value) {
      return { isValid: false, message: `Cart must be at least ${coupon.min_cart_value} to use this coupon.` };
    }

    // Check total usage limit
    if (coupon.usage_limit_total) {
      const [totalUses] = await pool.execute('SELECT COUNT(*) as count FROM orders WHERE coupon_id = ?', [coupon.id]);
      if (totalUses[0].count >= coupon.usage_limit_total) {
        return { isValid: false, message: 'This coupon has reached its maximum usage limit.' };
      }
    }

    // Check per-user usage limit
    if (coupon.usage_limit_per_user) {
      const [userUses] = await pool.execute('SELECT COUNT(*) as count FROM orders WHERE coupon_id = ? AND user_id = ?', [coupon.id, userId]);
      if (userUses[0].count >= coupon.usage_limit_per_user) {
        return { isValid: false, message: 'You have already used this coupon the maximum number of times.' };
      }
    }

    // If all checks pass, calculate the discount
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = cartTotal * (coupon.value / 100);
      if (coupon.max_discount && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    } else { // 'fixed'
      discount = coupon.value;
    }

    return { isValid: true, message: 'Coupon applied successfully!', discount: parseFloat(discount.toFixed(2)) };
  }
};

module.exports = Coupon;
