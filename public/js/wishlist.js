// public/js/wishlist.js
// Client-side logic for the wishlist functionality.

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    // --- Logic for the main wishlist page ---
    const wishlistItemsContainer = document.getElementById('wishlist-items');
    if (wishlistItemsContainer) {
        const fetchWishlist = async () => {
            if (!token) {
                wishlistItemsContainer.innerHTML = '<p class="text-danger">Please log in to see your wishlist.</p>';
                return;
            }
            try {
                const res = await fetch('/api/wishlist', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed to fetch wishlist.');

                const items = await res.json();
                if (items.length === 0) {
                    wishlistItemsContainer.innerHTML = '<p>Your wishlist is empty.</p>';
                } else {
                    wishlistItemsContainer.innerHTML = items.map(item => `
                        <div class="col-md-4 mb-4">
                            <div class="card">
                                <img src="/${item.image_path || 'images/placeholder.png'}" class="card-img-top" alt="${item.name}">
                                <div class="card-body">
                                    <h5 class="card-title">${item.name}</h5>
                                    <p class="card-text">₹${item.sale_price.toFixed(2)}</p>
                                    <button class="btn btn-danger remove-wishlist-btn" data-product-id="${item.product_id}">Remove</button>
                                </div>
                            </div>
                        </div>
                    `).join('');
                }
            } catch (error) {
                wishlistItemsContainer.innerHTML = `<p class="text-danger">${error.message}</p>`;
            }
        };

        // Add event listener for removing items from the wishlist page
        wishlistItemsContainer.addEventListener('click', async (e) => {
            if (e.target.classList.contains('remove-wishlist-btn')) {
                const productId = e.target.dataset.productId;
                await removeFromWishlist(productId);
                fetchWishlist(); // Refresh the list
            }
        });

        fetchWishlist();
    }

    // --- Logic for the "Add to Wishlist" button on other pages ---
    const addToWishlistBtn = document.querySelector('.wishlist-btn');
    if (addToWishlistBtn) {
        addToWishlistBtn.addEventListener('click', async (e) => {
            if (!token) {
                alert('Please log in to add items to your wishlist.');
                window.location.href = '/login';
                return;
            }
            const productId = e.target.dataset.productId;
            await addToWishlist(productId);
        });
    }
});

async function addToWishlist(productId) {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`/api/wishlist/${productId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        alert(data.message); // Simple feedback for now
    } catch (error) {
        alert('Could not add item to wishlist.');
    }
}

async function removeFromWishlist(productId) {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`/api/wishlist/${productId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        // No alert on removal from wishlist page, as the item just disappears
    } catch (error) {
        alert('Could not remove item from wishlist.');
    }
}
