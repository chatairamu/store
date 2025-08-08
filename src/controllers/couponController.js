// src/controllers/couponController.js
// Controller for applying coupons.

const Coupon = require('../models/Coupon');
const Cart = require('../models/Cart');

/**
 * Apply a coupon to the user's current cart.
 * @route POST /api/coupons/apply
 * @access Protected
 */
exports.applyCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;
    const userId = req.user.id;

    if (!couponCode) {
      return res.status(400).json({ message: 'Please provide a coupon code.' });
    }

    // 1. Find the coupon
    const coupon = await Coupon.findByCode(couponCode);
    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon code.' });
    }

    // 2. Get the user's cart to calculate the subtotal
    const cart = await Cart.findOrCreateByUserId(userId);
    const items = await Cart.getCartItems(cart.id);
    const subtotal = items.reduce((acc, item) => acc + (item.sale_price * item.quantity), 0);

    // 3. Validate the coupon against the cart and user
    const validationResult = await Coupon.validate(coupon, subtotal, userId);

    if (!validationResult.isValid) {
      return res.status(400).json({ message: validationResult.message });
    }

    // 4. Return the successful validation result
    res.status(200).json({
      message: validationResult.message,
      discountAmount: validationResult.discount,
      couponId: coupon.id
    });

  } catch (error) {
    console.error('Apply Coupon Error:', error);
    res.status(500).json({ message: 'Server error while applying coupon.' });
  }
};
