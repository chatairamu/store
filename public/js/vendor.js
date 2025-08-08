// public/js/vendor.js
// Client-side JavaScript for the vendor dashboard.

document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-product-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const productId = e.target.dataset.id;

            if (confirm(`Are you sure you want to delete product #${productId}? This action cannot be undone.`)) {
                try {
                    const csrfToken = document.querySelector('table').dataset.csrfToken;
                    const res = await fetch(`/vendor/products/${productId}`, {
                        method: 'DELETE',
                        headers: {
                            'X-CSRF-Token': csrfToken
                        }
                    });

                    if (res.ok) {
                        // On successful deletion, remove the table row or reload the page
                        alert('Product deleted successfully.');
                        window.location.reload();
                    } else {
                        const data = await res.json();
                        alert(`Error: ${data.message || 'Failed to delete product.'}`);
                    }
                } catch (err) {
                    console.error('Delete product error:', err);
                    alert('An error occurred while trying to delete the product.');
                }
            }
        });
    });
});
