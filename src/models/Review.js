// src/models/Review.js
// Model for interacting with the 'reviews' table.

const pool = require('../config/db');

const Review = {
  /**
   * Creates a new review.
   * @param {object} reviewData - The data for the new review.
   * @returns {Promise<object>} The result from the database insertion.
   */
  async create(reviewData) {
    const { user_id, product_id, vendor_id, rating, comment } = reviewData;
    const sql = `
      INSERT INTO reviews (user_id, product_id, vendor_id, rating, comment, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `;
    const [result] = await pool.execute(sql, [user_id, product_id, vendor_id, rating, comment]);
    return result;
  },

  /**
   * Finds all approved reviews for a specific product.
   * @param {number} productId - The ID of the product.
   * @returns {Promise<Array>} An array of review objects with user names.
   */
  async findByProductId(productId) {
    const sql = `
      SELECT r.*, u.name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ? AND r.status = 'approved'
      ORDER BY r.created_at DESC
    `;
    const [rows] = await pool.execute(sql, [productId]);
    return rows;
  },

  /**
   * Finds all reviews that are pending moderation.
   * @returns {Promise<Array>} An array of pending review objects.
   */
  async findAllPending() {
    const sql = `
      SELECT r.*, u.name as user_name, p.name as product_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN products p ON r.product_id = p.id
      WHERE r.status = 'pending'
      ORDER BY r.created_at ASC
    `;
    const [rows] = await pool.execute(sql);
    return rows;
  },

  /**
   * Updates the status of a review (approve/reject).
   * @param {number} reviewId - The ID of the review to update.
   * @param {string} newStatus - The new status ('approved' or 'rejected').
   * @returns {Promise<object>} The result of the update operation.
   */
  async updateStatus(reviewId, newStatus) {
    const allowedStatuses = ['approved', 'rejected'];
    if (!allowedStatuses.includes(newStatus)) {
      throw new Error('Invalid review status.');
    }
    const sql = 'UPDATE reviews SET status = ? WHERE id = ?';
    const [result] = await pool.execute(sql, [newStatus, reviewId]);
    return result;
  }
};

module.exports = Review;
