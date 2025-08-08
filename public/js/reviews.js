// public/js/reviews.js
// Client-side logic for submitting product reviews.

document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('review-form');
    const reviewMessageDiv = document.getElementById('review-message');
    const token = localStorage.getItem('token');

    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get product ID from the current URL
            const productId = window.location.pathname.split('/').pop();

            const rating = document.getElementById('rating').value;
            const comment = document.getElementById('comment').value;

            if (!rating) {
                reviewMessageDiv.className = 'alert alert-danger';
                reviewMessageDiv.textContent = 'Please select a rating.';
                return;
            }

            try {
                const res = await fetch(`/api/reviews/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ rating, comment })
                });

                const data = await res.json();

                if (res.ok) {
                    reviewMessageDiv.className = 'alert alert-success';
                    reviewMessageDiv.textContent = data.message;
                    reviewForm.reset();
                } else {
                    reviewMessageDiv.className = 'alert alert-danger';
                    reviewMessageDiv.textContent = data.message || 'An error occurred.';
                }

            } catch (err) {
                reviewMessageDiv.className = 'alert alert-danger';
                reviewMessageDiv.textContent = 'Failed to connect to the server.';
            }
        });
    }
});
