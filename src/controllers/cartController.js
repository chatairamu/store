// src/controllers/cartController.js
// Controller for managing the shopping cart.

const Cart = require('../models/Cart');

/**
 * Get the current user's cart.
 * @route GET /api/cart
 * @access Protected
 */
exports.getCart = async (req, res) => {
  try {
    // req.user.id is attached by the 'protect' middleware
    const cart = await Cart.findOrCreateByUserId(req.user.id);
    const items = await Cart.getCartItems(cart.id);

    // You might want to calculate totals here as well
    const subtotal = items.reduce((acc, item) => acc + (item.sale_price * item.quantity), 0);

    res.status(200).json({
      cartId: cart.id,
      items,
      subtotal
    });
  } catch (error) {
    console.error('Get Cart Error:', error);
    res.status(500).json({ message: 'Server error while fetching the cart.' });
  }
};

/**
 * Add an item to the user's cart.
 * @route POST /api/cart
 * @access Protected
 */
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Please provide a valid product ID and quantity.' });
    }

    const cart = await Cart.findOrCreateByUserId(req.user.id);
    await Cart.addItem(cart.id, productId, quantity);

    res.status(201).json({ message: 'Item added to cart successfully.' });
  } catch (error) {
    console.error('Add to Cart Error:', error);
    res.status(500).json({ message: 'Server error while adding item to cart.' });
  }
};

/**
 * Update an item's quantity in the cart.
 * @route PUT /api/cart/:itemId
 * @access Protected
 */
// Reusable helper function to get full cart details
const getFullCart = async (userId) => {
    const cart = await Cart.findOrCreateByUserId(userId);
    const items = await Cart.getCartItems(cart.id);
    const subtotal = items.reduce((acc, item) => acc + (item.sale_price * item.quantity), 0);
    return { cartId: cart.id, items, subtotal };
};

exports.getCart = async (req, res) => {
  try {
    const cartData = await getFullCart(req.user.id);
    res.status(200).json(cartData);
  } catch (error) {
    console.error('Get Cart Error:', error);
    res.status(500).json({ message: 'Server error while fetching the cart.' });
  }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;

        if (quantity === undefined || quantity < 0) {
            return res.status(400).json({ message: 'Please provide a valid quantity.' });
        }

        // TODO: Security check to ensure item belongs to user's cart

        await Cart.updateItemQuantity(itemId, quantity);

        // After updating, send back the new state of the cart
        const updatedCart = await getFullCart(req.user.id);
        res.status(200).json({ message: 'Cart updated successfully.', cart: updatedCart });

    } catch (error) {
        console.error('Update Cart Item Error:', error);
        res.status(500).json({ message: 'Server error while updating cart item.' });
    }
};

/**
 * Remove an item from the cart.
 * @route DELETE /api/cart/:itemId
 * @access Protected
 */
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    // TODO: Security check

    await Cart.removeItem(itemId);

    // After removing, send back the new state of the cart
    const updatedCart = await getFullCart(req.user.id);
    res.status(200).json({ message: 'Item removed successfully.', cart: updatedCart });

  } catch (error) {
    console.error('Remove from Cart Error:', error);
    res.status(500).json({ message: 'Server error while removing item from cart.' });
  }
};
