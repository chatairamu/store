// public/js/products.js
// Client-side logic for fetching and displaying products with filtering.

document.addEventListener('DOMContentLoaded', () => {
    const productListContainer = document.getElementById('product-list');

    const fetchProducts = async () => {
        try {
            // Get filter parameters from the URL's query string
            const params = new URLSearchParams(window.location.search);
            const tagId = params.get('tagId');

            let apiUrl = '/api/products';
            if (tagId) {
                apiUrl += `?tagId=${tagId}`;
            }

            const res = await fetch(apiUrl);
            if (!res.ok) throw new Error('Failed to fetch products.');

            const products = await res.json();
            renderProducts(products);

        } catch (error) {
            productListContainer.innerHTML = `<p class="text-danger">${error.message}</p>`;
        }
    };

    const renderProducts = (products) => {
        if (!products || products.length === 0) {
            productListContainer.innerHTML = '<p>No products found for this filter.</p>';
            return;
        }

        productListContainer.innerHTML = products.map(product => `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="/${product.image_path || 'images/placeholder.png'}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">₹${product.sale_price.toFixed(2)}</p>
                        <a href="/product/${product.id}" class="btn btn-primary">View Details</a>
                    </div>
                </div>
            </div>
        `).join('');
    };

    fetchProducts();
});
