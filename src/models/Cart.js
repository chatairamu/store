// src/models/Cart.js
// The Cart model for managing shopping cart data.

const pool = require('../config/db');

const Cart = {
  /**
   * Finds or creates a cart for a given user.
   * @param {number} userId - The ID of the user.
   * @returns {Promise<object>} The user's cart object.
   */
  async findOrCreateByUserId(userId) {
    // First, try to find an existing cart
    let [carts] = await pool.execute('SELECT * FROM cart WHERE user_id = ?', [userId]);

    if (carts.length > 0) {
      return carts[0]; // Return existing cart
    } else {
      // If no cart, create a new one
      const [result] = await pool.execute('INSERT INTO cart (user_id) VALUES (?)', [userId]);
      const [newCarts] = await pool.execute('SELECT * FROM cart WHERE id = ?', [result.insertId]);
      return newCarts[0];
    }
  },

  /**
   * Gets all items in a given cart, with product details.
   * @param {number} cartId - The ID of the cart.
   * @returns {Promise<Array>} An array of cart item objects.
   */
  async getCartItems(cartId) {
    const sql = `
      SELECT
        ci.id as cart_item_id,
        ci.quantity,
        p.id as product_id,
        p.vendor_id,
        p.name,
        p.sale_price,
        p.mrp,
        pi.image_path
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN (
        SELECT product_id, image_path
        FROM product_images
        WHERE is_featured = 1
      ) pi ON p.id = pi.product_id
      WHERE ci.cart_id = ?
    `;
    const [items] = await pool.execute(sql, [cartId]);
    return items;
  },

  /**
   * Adds an item to the cart or updates its quantity if it already exists.
   * @param {number} cartId - The ID of the cart.
   * @param {number} productId - The ID of the product to add.
   * @param {number} quantity - The quantity to add.
   * @returns {Promise<object>} The result of the database operation.
   */
  async addItem(cartId, productId, quantity) {
    // Check if the item is already in the cart
    const [existingItems] = await pool.execute(
      'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );

    if (existingItems.length > 0) {
      // If item exists, update its quantity
      const newQuantity = existingItems[0].quantity + quantity;
      return await pool.execute(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [newQuantity, existingItems[0].id]
      );
    } else {
      // If item does not exist, insert it
      const [product] = await pool.execute('SELECT sale_price FROM products WHERE id = ?', [productId]);
      if (!product.length) throw new Error('Product not found');

      return await pool.execute(
        'INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [cartId, productId, quantity, product[0].sale_price]
      );
    }
  },

  /**
   * Removes an item from the cart.
   * @param {number} cartItemId - The ID of the cart item to remove.
   * @returns {Promise<object>} The result of the delete operation.
   */
  async removeItem(cartItemId) {
    return await pool.execute('DELETE FROM cart_items WHERE id = ?', [cartItemId]);
  },

  /**
   * Updates the quantity of a specific item in the cart.
   * @param {number} cartItemId - The ID of the cart item to update.
   * @param {number} quantity - The new quantity.
   * @returns {Promise<object>} The result of the update operation.
   */
  async updateItemQuantity(cartItemId, quantity) {
    if (quantity <= 0) {
      // If quantity is 0 or less, remove the item
      return this.removeItem(cartItemId);
    } else {
      return await pool.execute('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, cartItemId]);
    }
  }
};

module.exports = Cart;
