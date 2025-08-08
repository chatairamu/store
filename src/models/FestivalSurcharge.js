// src/models/FestivalSurcharge.js
// Model for interacting with the 'festival_surcharges' table.

const pool = require('../config/db');

const FestivalSurcharge = {
  /**
   * Finds an active surcharge for a specific date.
   * @param {Date} date - The date to check for a surcharge.
   * @returns {Promise<object|null>} The surcharge object if one is active, otherwise null.
   */
  async findActiveSurchargeForDate(date) {
    // The date needs to be in 'YYYY-MM-DD' format for the SQL query.
    const checkDate = date.toISOString().split('T')[0];

    const sql = `
      SELECT * FROM festival_surcharges
      WHERE status = 'active' AND ? BETWEEN start_date AND end_date
      LIMIT 1
    `;
    const [rows] = await pool.execute(sql, [checkDate]);
    return rows[0] || null;
  },

  /**
   * Finds all festival surcharges.
   * @returns {Promise<Array>} An array of all surcharge objects.
   */
  async findAll() {
    const sql = 'SELECT * FROM festival_surcharges ORDER BY start_date DESC';
    const [rows] = await pool.execute(sql);
    return rows;
  }
};

module.exports = FestivalSurcharge;
