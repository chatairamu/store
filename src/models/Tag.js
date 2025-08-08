// src/models/Tag.js
// Model for interacting with the 'tags' table.

const pool = require('../config/db');

const Tag = {
  /**
   * Creates a new tag.
   * @param {string} name - The name of the tag.
   * @returns {Promise<object>} The result of the database insertion.
   */
  async create(name) {
    const sql = 'INSERT INTO tags (name) VALUES (?)';
    const [result] = await pool.execute(sql, [name]);
    return result;
  },

  /**
   * Finds all tags.
   * @returns {Promise<Array>} An array of all tag objects.
   */
  async findAll() {
    const sql = 'SELECT * FROM tags ORDER BY name ASC';
    const [rows] = await pool.execute(sql);
    return rows;
  }
};

module.exports = Tag;
