// src/controllers/paymentController.js
// Controller for handling payment gateway interactions.

const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Creates a Razorpay order to initiate a payment.
 * @route POST /api/payments/create-order
 */
exports.createRazorpayOrder = async (req, res) => {
    try {
        const { amount, currency } = req.body; // amount should be in the smallest currency unit (e.g., paise for INR)

        if (!amount || !currency) {
            return res.status(400).json({ message: 'Amount and currency are required.' });
        }

        const options = {
            amount: amount,
            currency: currency,
            receipt: `receipt_order_${new Date().getTime()}`,
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).send('Error creating Razorpay order.');
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Create Razorpay Order Error:', error);
        res.status(500).json({ message: 'Server error while creating payment order.' });
    }
};

/**
 * Verifies the payment signature from Razorpay.
 * If successful, it creates the order in our database.
 * @route POST /api/payments/verify
 */
exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            order_details // This will contain the cart info, address, etc. needed to create our own order
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_details) {
            return res.status(400).json({ message: 'Missing payment verification details.' });
        }

        // 1. Verify the signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // 2. Signature is valid. Now create the order in our database.
            // Note: In a real app, you would re-fetch the cart from the session/DB
            // to ensure the price hasn't been tampered with on the client-side.
            const userId = req.user.id;
            const newOrderId = await Order.create(userId, order_details);

            // You could also log the transaction here.

            res.status(200).json({
                success: true,
                message: 'Payment verified successfully and order placed.',
                orderId: newOrderId
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid payment signature.' });
        }
    } catch (error) {
        console.error('Verify Payment Error:', error);
        res.status(500).json({ message: 'Server error during payment verification.' });
    }
};
