// public/js/cart.js
// Client-side logic for making the shopping cart page interactive.

document.addEventListener('DOMContentLoaded', () => {
    const cartTableBody = document.querySelector('#cart-table tbody');
    const cartSummary = document.getElementById('cart-summary');
    const token = localStorage.getItem('token');

    // Function to render the entire cart
    const renderCart = (cart) => {
        if (!cart || !cart.items || cart.items.length === 0) {
            cartTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Your cart is empty.</td></tr>';
            cartSummary.innerHTML = '<p>No items in cart.</p>';
            return;
        }

        // Render table rows
        cartTableBody.innerHTML = cart.items.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>₹${item.sale_price.toFixed(2)}</td>
                <td>
                    <input type="number" class="form-control form-control-sm quantity-input" value="${item.quantity}" min="1" data-item-id="${item.cart_item_id}">
                </td>
                <td>₹${(item.sale_price * item.quantity).toFixed(2)}</td>
                <td>
                    <button class="btn btn-danger btn-sm remove-btn" data-item-id="${item.cart_item_id}">Remove</button>
                </td>
            </tr>
        `).join('');

        // Render summary
        cartSummary.innerHTML = `
            <h5>Cart Summary</h5>
            <p>Subtotal: ₹${cart.totals.subtotal.toFixed(2)}</p>
            <p>GST: ₹${cart.totals.gstTotal.toFixed(2)}</p>
            <p><strong>Total: ₹${cart.totals.grandTotal.toFixed(2)}</strong></p>
            <a href="/checkout" class="btn btn-primary w-100">Proceed to Checkout</a>
        `;
    };

    // Function to fetch the cart data
    const fetchCart = async () => {
        if (!token) {
            renderCart(null);
            return;
        }
        try {
            const res = await fetch('/api/cart', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch cart.');
            const cartData = await res.json();
            renderCart(cartData);
        } catch (error) {
            cartTableBody.innerHTML = `<tr><td colspan="5" class="text-danger">${error.message}</td></tr>`;
        }
    };

    // Event handler for updating quantity or removing items
    cartTableBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const itemId = e.target.dataset.itemId;
            const csrfToken = document.getElementById('cart-table').dataset.csrfToken;
            const res = await fetch(`/api/cart/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-CSRF-Token': csrfToken
                }
            });
            const data = await res.json();
            renderCart(data.cart);
        }
    });

    cartTableBody.addEventListener('change', async (e) => {
        if (e.target.classList.contains('quantity-input')) {
            const itemId = e.target.dataset.itemId;
            const quantity = e.target.value;
            const csrfToken = document.getElementById('cart-table').dataset.csrfToken;
            const res = await fetch(`/api/cart/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-CSRF-Token': csrfToken
                },
                body: JSON.stringify({ quantity: parseInt(quantity) })
            });
            const data = await res.json();
            renderCart(data.cart);
        }
    });

    // Initial fetch of the cart
    fetchCart();
});
