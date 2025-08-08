// public/js/auth.js
// Frontend javascript for handling login and registration forms.

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Login logic will go here
            console.log('Login form submitted');
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const messageDiv = document.getElementById('login-message');

            try {
                const res = await fetch('/api/auth/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();

                if (res.ok) {
                    messageDiv.className = 'alert alert-success';
                    messageDiv.textContent = data.message;
                    localStorage.setItem('token', data.token);
                    // Redirect to account page after a short delay
                    setTimeout(() => {
                        window.location.href = '/account';
                    }, 1000);
                } else {
                    messageDiv.className = 'alert alert-danger';
                    messageDiv.textContent = data.message || 'An error occurred.';
                }

            } catch (err) {
                messageDiv.className = 'alert alert-danger';
                messageDiv.textContent = 'Failed to connect to the server.';
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Register logic will go here
            console.log('Register form submitted');
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const messageDiv = document.getElementById('register-message');

            try {
                const res = await fetch('/api/auth/user/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, phone, password })
                });

                const data = await res.json();

                if (res.ok) {
                    messageDiv.className = 'alert alert-success';
                    messageDiv.textContent = data.message;
                    localStorage.setItem('token', data.token);
                    // Redirect to account page
                    setTimeout(() => {
                        window.location.href = '/account';
                    }, 1000);
                } else {
                    messageDiv.className = 'alert alert-danger';
                    messageDiv.textContent = data.message || 'An error occurred.';
                }

            } catch (err) {
                messageDiv.className = 'alert alert-danger';
                messageDiv.textContent = 'Failed to connect to the server.';
            }
        });
    }
});
