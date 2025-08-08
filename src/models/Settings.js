// src/models/Settings.js
// Model for interacting with the 'delivery_settings' table.

const pool = require('../config/db');

const Settings = {
  /**
   * Retrieves all delivery settings from the database.
   * @returns {Promise<object>} An object where keys are setting_key and values are setting_value.
   */
  async getAllDeliverySettings() {
    const sql = 'SELECT setting_key, setting_value FROM delivery_settings';
    const [rows] = await pool.execute(sql);

    // Convert array of objects to a single settings object
    const settings = rows.reduce((acc, row) => {
      // Convert numeric strings to numbers
      acc[row.setting_key] = isNaN(row.setting_value) ? row.setting_value : Number(row.setting_value);
      return acc;
    }, {});

    return settings;
  },

  /**
   * Updates multiple delivery settings.
   * @param {object} settingsObject - An object of key-value pairs to update.
   * @returns {Promise<void>}
   */
  async updateDeliverySettings(settingsObject) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      for (const key in settingsObject) {
        if (Object.hasOwnProperty.call(settingsObject, key)) {
          const value = settingsObject[key];
          const sql = 'UPDATE delivery_settings SET setting_value = ? WHERE setting_key = ?';
          await connection.execute(sql, [value, key]);
        }
      }
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      console.error('Update Settings Transaction Error:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
};

module.exports = Settings;
