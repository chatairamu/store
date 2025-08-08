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
    const sql = 'SELECT id, name, owner_name, email, phone, address, city, state, pincode, status, created_at FROM vendors WHERE id = ?';
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

module.exports = Vendor;
