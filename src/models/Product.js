// src/models/Product.js
// The Product model for interacting with the 'products' table.

const pool = require('../config/db');

const Product = {
  /**
   * Finds all products, optionally filtering by category.
   * @param {number|null} categoryId - The ID of the category to filter by.
   * @returns {Promise<Array>} An array of product objects.
   */
  async findAll(categoryId = null) {
    let sql = `
      SELECT
        p.*,
        c.name as category_name,
        v.name as vendor_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN vendors v ON p.vendor_id = v.id
    `;
    const params = [];

    if (categoryId) {
      sql += ' WHERE p.category_id = ?';
      params.push(categoryId);
    }

    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  /**
   * Finds a single product by its ID.
   * @param {number} id - The ID of the product to find.
   * @returns {Promise<object|null>} The product object if found, otherwise null.
   */
  async findById(id) {
    const sql = `
      SELECT
        p.*,
        c.name as category_name,
        v.name as vendor_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN vendors v ON p.vendor_id = v.id
      WHERE p.id = ?
    `;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
  },

  /**
   * Creates a new product.
   * This is a protected action, only for vendors/admins.
   * @param {object} productData - The data for the new product.
   * @returns {Promise<object>} The result from the database insertion.
   */
  async create(productData) {
    const {
      vendor_id,
      category_id,
      name,
      description,
      mrp,
      sale_price,
      gst_slab_id,
      stock,
      weight,
      is_special_product,
      special_price,
      special_price_start,
      special_price_end
    } = productData;

    const sql = `
      INSERT INTO products
      (vendor_id, category_id, name, description, mrp, sale_price, gst_slab_id, stock, weight, is_special_product, special_price, special_price_start, special_price_end)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(sql, [
      vendor_id, category_id, name, description, mrp, sale_price, gst_slab_id, stock, weight || 0, is_special_product || 0, special_price || null, special_price_start || null, special_price_end || null
    ]);

    return result;
  }
};

  /**
   * Finds all products belonging to a specific vendor.
   * @param {number} vendorId - The ID of the vendor.
   * @returns {Promise<Array>} An array of product objects.
   */
  async findByVendorId(vendorId) {
    const sql = `
      SELECT p.*, c.name as category_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.vendor_id = ?
    `;
    const [rows] = await pool.execute(sql, [vendorId]);
    return rows;
  },

  /**
   * Updates an existing product.
   * @param {number} productId - The ID of the product to update.
   * @param {object} productData - The new data for the product.
   * @returns {Promise<object>} The result of the update operation.
   */
  async update(productId, productData) {
    // This is a simplified update. A real app might have more complex logic.
    const { name, description, mrp, sale_price, stock, status, weight, is_special_product, special_price, special_price_start, special_price_end } = productData;
    const sql = `
      UPDATE products
      SET name = ?, description = ?, mrp = ?, sale_price = ?, stock = ?, status = ?, weight = ?, is_special_product = ?, special_price = ?, special_price_start = ?, special_price_end = ?
      WHERE id = ?
    `;
    const [result] = await pool.execute(sql, [name, description, mrp, sale_price, stock, status, weight, is_special_product, special_price || null, special_price_start || null, special_price_end || null, productId]);
    return result;
  },

  /**
   * Deletes a product from the database.
   * @param {number} productId - The ID of the product to delete.
   * @returns {Promise<object>} The result of the delete operation.
   */
  async delete(productId) {
    const sql = 'DELETE FROM products WHERE id = ?';
    const [result] = await pool.execute(sql, [productId]);
    return result;
  }
};

  /**
   * Adds an image record for a product.
   * @param {number} productId - The ID of the product.
   * @param {string} imagePath - The path to the uploaded image.
   * @returns {Promise<object>}
   */
  async addImage(productId, imagePath) {
    // For simplicity, we assume one featured image per product.
    // A more complex system might handle multiple images and update existing ones.
    const sql = 'INSERT INTO product_images (product_id, image_path, is_featured) VALUES (?, ?, ?)';
    const [result] = await pool.execute(sql, [productId, imagePath, 1]);
    return result;
  }
};

module.exports = Product;
