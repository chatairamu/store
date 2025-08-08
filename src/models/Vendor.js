// src/models/Vendor.js
// The Vendor model for interacting with the 'vendors' table.

const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const Vendor = {
  /**
   * Creates a new vendor.
   * Note: This is a simplified create method. A real implementation
   * would handle all the fields from the database.sql schema.
   * @param {object} vendorData - The data for the new vendor.
   * @returns {Promise<object>} The result from the database insertion.
   */
  async create(vendorData) {
    const { name, owner_name, email, phone, password, address, city, state, pincode } = vendorData;

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql = `
      INSERT INTO vendors
      (name, owner_name, email, phone, password, address, city, state, pincode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(sql, [
      name, owner_name, email, phone, hashedPassword, address, city, state, pincode
    ]);

    return result;
  },

  /**
   * Finds a vendor by their email address.
   * @param {string} email - The email to search for.
   * @returns {Promise<object|null>} The vendor object if found, otherwise null.
   */
  async findByEmail(email) {
    const sql = 'SELECT * FROM vendors WHERE email = ?';
    const [rows] = await pool.execute(sql, [email]);
    return rows[0] || null;
  },

  /**
   * Finds a vendor by their ID.
   * @param {number} id - The ID of the vendor to find.
   * @returns {Promise<object|null>} The vendor object if found, otherwise null.
   */
  async findById(id) {
    // Exclude password from the result for security
    const sql = 'SELECT id, name, owner_name, email, phone, address, city, state, pincode, status, min_cart_value, created_at FROM vendors WHERE id = ?';
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
  },

  /**
   * Compares a candidate password with the vendor's stored hashed password.
   * @param {string} candidatePassword - The plain text password to compare.
   * @param {string} hashedPassword - The hashed password from the database.
   * @returns {Promise<boolean>} True if the passwords match, otherwise false.
   */
  async comparePasswords(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
};

  /**
   * Finds all vendors.
   * @returns {Promise<Array>} An array of vendor objects.
   */
  async findAll() {
    const sql = 'SELECT id, name, owner_name, email, phone, status, created_at FROM vendors ORDER BY created_at DESC';
    const [rows] = await pool.execute(sql);
    return rows;
  }
};

  /**
   * Updates the status of a vendor (e.g., for admin approval).
   * @param {number} vendorId - The ID of the vendor to update.
   * @param {string} newStatus - The new status ('approved', 'rejected').
   * @returns {Promise<object>} The result of the update operation.
   */
  async updateStatus(vendorId, newStatus) {
    const allowedStatuses = ['pending', 'approved', 'rejected'];
    if (!allowedStatuses.includes(newStatus)) {
      throw new Error('Invalid vendor status.');
    }

    const sql = 'UPDATE vendors SET status = ? WHERE id = ?';
    const [result] = await pool.execute(sql, [newStatus, vendorId]);
    return result;
  }
};

  /**
   * Calculates the net earnings for a vendor after commission.
   * @param {number} vendorId - The ID of the vendor.
   * @returns {Promise<number>} The net earnings.
   */
  async calculateEarnings(vendorId) {
    const [vendorRows] = await pool.execute('SELECT commission_rate FROM vendors WHERE id = ?', [vendorId]);
    if (vendorRows.length === 0) return 0;
    const commissionRate = vendorRows[0].commission_rate;

    const sql = `
        SELECT SUM(o.order_total) as grossEarnings
        FROM orders o
        WHERE o.vendor_id = ? AND o.order_status = 'Delivered'
    `;
    const [result] = await pool.execute(sql, [vendorId]);
    const grossEarnings = result[0].grossEarnings || 0;

    const commissionAmount = grossEarnings * (commissionRate / 100);
    const netEarnings = grossEarnings - commissionAmount;

    return parseFloat(netEarnings.toFixed(2));
  }
};

module.exports = Vendor;
