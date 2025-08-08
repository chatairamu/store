// src/models/User.js
// The User model for interacting with the 'users' table in the database.

const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  /**
   * Creates a new user in the database.
   * @param {string} name - The user's full name.
   * @param {string} email - The user's email address.
   * @param {string} phone - The user's phone number.
   * @param {string} password - The user's plain text password.
   * @returns {Promise<object>} The result from the database insertion.
   */
  async create(name, email, phone, password) {
    // Hash the password before storing it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql = 'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)';
    const [result] = await pool.execute(sql, [name, email, phone, hashedPassword]);
    return result;
  },

  /**
   * Finds a user by their email address.
   * @param {string} email - The email to search for.
   * @returns {Promise<object|null>} The user object if found, otherwise null.
   */
  async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.execute(sql, [email]);
    return rows[0] || null;
  },

  /**
   * Finds a user by their ID.
   * @param {number} id - The ID of the user to find.
   * @returns {Promise<object|null>} The user object if found, otherwise null.
   */
  async findById(id) {
    const sql = 'SELECT id, name, email, phone, is_admin, created_at FROM users WHERE id = ?';
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
  },

  /**
   * Compares a candidate password with the user's stored hashed password.
   * @param {string} candidatePassword - The plain text password to compare.
   * @param {string} hashedPassword - The hashed password from the database.
   * @returns {Promise<boolean>} True if the passwords match, otherwise false.
   */
  async comparePasswords(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
};

  /**
   * Finds all users.
   * @returns {Promise<Array>} An array of user objects.
   */
  async findAll() {
    const sql = 'SELECT id, name, email, phone, is_admin, created_at FROM users ORDER BY created_at DESC';
    const [rows] = await pool.execute(sql);
    return rows;
  }
};

module.exports = User;
