// src/models/Wishlist.js
// Model for interacting with the 'wishlists' table.

const pool = require('../config/db');

const Wishlist = {
  /**
   * Finds all items in a user's wishlist.
   * @param {number} userId - The ID of the user.
   * @returns {Promise<Array>} An array of wishlist items with product details.
   */
  async findByUserId(userId) {
    const sql = `
      SELECT
        w.product_id,
        p.name,
        p.sale_price,
        p.mrp,
        pi.image_path
      FROM wishlists w
      JOIN products p ON w.product_id = p.id
      LEFT JOIN (
        SELECT product_id, image_path
        FROM product_images
        WHERE is_featured = 1
      ) pi ON p.id = pi.product_id
      WHERE w.user_id = ?
    `;
    const [rows] = await pool.execute(sql, [userId]);
    return rows;
  },

  /**
   * Adds a product to a user's wishlist.
   * It avoids adding duplicates.
   * @param {number} userId - The ID of the user.
   * @param {number} productId - The ID of the product to add.
   * @returns {Promise<object>} The result of the database insertion.
   */
  async add(userId, productId) {
    // Check if the item is already in the wishlist to avoid duplicates
    const [existing] = await pool.execute(
      'SELECT * FROM wishlists WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (existing.length > 0) {
      // Item already exists, do nothing or return a specific message
      return { message: 'Item already in wishlist.' };
    }

    const sql = 'INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)';
    const [result] = await pool.execute(sql, [userId, productId]);
    return result;
  },

  /**
   * Removes a product from a user's wishlist.
   * @param {number} userId - The ID of the user.
   * @param {number} productId - The ID of the product to remove.
   * @returns {Promise<object>} The result of the delete operation.
   */
  async remove(userId, productId) {
    const sql = 'DELETE FROM wishlists WHERE user_id = ? AND product_id = ?';
    const [result] = await pool.execute(sql, [userId, productId]);
    return result;
  }
};

module.exports = Wishlist;
