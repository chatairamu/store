// public/js/checkout.js
// Client-side logic for the checkout and payment process.

document.addEventListener('DOMContentLoaded', () => {
    const orderSummaryDiv = document.getElementById('order-summary');
    const totalAmountSpan = document.getElementById('total-amount');
    const payButton = document.getElementById('pay-button');
    const paymentMessageDiv = document.getElementById('payment-message');
    const token = localStorage.getItem('token');

    let cartData = {};

    // 1. Fetch cart details to display summary and get total
    const fetchCart = async () => {
        if (!token) {
            orderSummaryDiv.innerHTML = '<p class="text-danger">You must be logged in to check out.</p>';
            payButton.disabled = true;
            return;
        }
        try {
            const res = await fetch('/api/cart', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch cart.');

            cartData = await res.json();

            // Render cart summary
            if (cartData.items.length === 0) {
                orderSummaryDiv.innerHTML = '<p>Your cart is empty.</p>';
                payButton.disabled = true;
            } else {
                let summaryHtml = '<ul class="list-group">';
                cartData.items.forEach(item => {
                    summaryHtml += `<li class="list-group-item d-flex justify-content-between align-items-center">
                        ${item.name} (x${item.quantity})
                        <span>₹${(item.sale_price * item.quantity).toFixed(2)}</span>
                    </li>`;
                });
                summaryHtml += '</ul>';
                orderSummaryDiv.innerHTML = summaryHtml;
                // Use the accurate totals from the API
                totalAmountSpan.textContent = cartData.totals.grandTotal.toFixed(2);
            }
        } catch (error) {
            orderSummaryDiv.innerHTML = `<p class="text-danger">${error.message}</p>`;
            payButton.disabled = true;
        }
    };

    // 2. Add click listener to the pay button
    payButton.addEventListener('click', async () => {
        paymentMessageDiv.textContent = 'Initializing payment...';
        paymentMessageDiv.className = 'alert alert-info';

        try {
            // 3. Create a Razorpay order from our backend using the accurate grand total
            const amountInPaise = Math.round(cartData.totals.grandTotal * 100);
            const orderRes = await fetch('/api/payments/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount: amountInPaise, currency: 'INR' })
            });

            if (!orderRes.ok) throw new Error('Could not create payment order.');
            const rzpOrder = await orderRes.json();

            // 4. Configure and open Razorpay checkout modal
            const options = {
                key: 'rzp_test_your_key_id', // You should fetch this from a config endpoint
                amount: rzpOrder.amount,
                currency: rzpOrder.currency,
                name: 'Orugallu Biryani',
                description: 'Order Payment',
                order_id: rzpOrder.id,
                handler: async function (response) {
                    // 5. Handle successful payment
                    paymentMessageDiv.textContent = 'Verifying payment...';
                    const verifyRes = await fetch('/api/payments/verify', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        // Prepare order details for our own backend
                        const orderDetailsPayload = {
                            address_id: 1, // Placeholder, should be selected by user
                            payment_method: 'Razorpay',
                            delivery_type: 'home_delivery',
                            sub_total: cartData.subtotal,
                            // In a real app, these would be calculated on the server
                            delivery_charge: 50.00,
                            packaging_charge: cartData.items.length * 10.00,
                            gst_total: cartData.subtotal * 0.18,
                            order_total: cartData.subtotal + 50.00 + (cartData.items.length * 10.00) + (cartData.subtotal * 0.18)
                        };

                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            order_details: orderDetailsPayload
                        })
                    });

                    const verifyData = await verifyRes.json();
                    if (verifyRes.ok && verifyData.success) {
                        paymentMessageDiv.className = 'alert alert-success';
                        paymentMessageDiv.textContent = 'Payment successful! Redirecting...';
                        // 6. Redirect to a success page
                        setTimeout(() => window.location.href = '/account', 2000);
                    } else {
                        throw new Error(verifyData.message || 'Payment verification failed.');
                    }
                },
                prefill: {
                    name: 'Customer Name', // Prefill with user data from your app
                    email: 'customer@example.com',
                },
                theme: {
                    color: '#3399cc'
                }
            };

            const rzp = new Razorpay(options);
            rzp.open();

        } catch (error) {
            paymentMessageDiv.className = 'alert alert-danger';
            paymentMessageDiv.textContent = error.message;
        }
    });

    // Initial fetch of the cart
    fetchCart();
});
