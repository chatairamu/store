// src/middleware/csrfMiddleware.js
// Middleware for CSRF protection using the Double Submit Cookie pattern.

const crypto = require('crypto');

const CSRF_COOKIE_NAME = '_csrf';
const CSRF_HEADER_NAME = 'x-csrf-token';

/**
 * Middleware to generate and set a CSRF token.
 * This should be used on routes that render forms.
 */
const generateToken = (req, res, next) => {
    const csrfToken = crypto.randomBytes(16).toString('hex');

    // Set the token as a cookie
    res.cookie(CSRF_COOKIE_NAME, csrfToken, {
        httpOnly: true, // The cookie is not accessible via client-side script
        secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
        // sameSite: 'strict' // Recommended for stronger protection
    });

    // Also attach it to locals so views can embed it in forms
    res.locals.csrfToken = csrfToken;

    next();
};

/**
 * Middleware to validate the CSRF token on state-changing requests.
 * This should be used on POST, PUT, DELETE, PATCH routes.
 */
const validateToken = (req, res, next) => {
    const csrfTokenFromCookie = req.cookies[CSRF_COOKIE_NAME];
    const csrfTokenFromHeader = req.headers[CSRF_HEADER_NAME];

    if (!csrfTokenFromCookie || !csrfTokenFromHeader || csrfTokenFromCookie !== csrfTokenFromHeader) {
        return res.status(403).json({ message: 'Invalid CSRF token. Request rejected.' });
    }

    next();
};


module.exports = { generateToken, validateToken };
