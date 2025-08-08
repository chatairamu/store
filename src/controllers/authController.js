// src/controllers/authController.js
// Controller for handling user and vendor authentication logic.

const User = require('../models/User');
const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// --- Helper Function to Generate JWT ---
const generateToken = (id, userType = 'user') => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};


// --- User Authentication ---

/**
 * Register a new user.
 * @route POST /api/auth/user/register
 */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Basic validation
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    // Create new user
    await User.create(name, email, phone, password);

    // Find the new user to get their ID
    const newUser = await User.findByEmail(email);

    // Generate a token and send response
    const token = generateToken(newUser.id, 'user');
    res.status(201).json({
      message: 'User registered successfully!',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('User Registration Error:', error);
    res.status(500).json({ message: 'Server error during user registration.' });
  }
};

/**
 * Login an existing user.
 * @route POST /api/auth/user/login
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    // Check if user exists
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Check if password is correct
    const isMatch = await User.comparePasswords(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate a token and send response
    const token = generateToken(user.id, 'user');
    res.status(200).json({
      message: 'Logged in successfully!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('User Login Error:', error);
    res.status(500).json({ message: 'Server error during user login.' });
  }
};


// --- Vendor Authentication (Placeholder) ---
// You would implement registerVendor and loginVendor here in a similar fashion.

/**
 * Register a new vendor.
 * @route POST /api/auth/vendor/register
 */
exports.registerVendor = async (req, res) => {
    // TODO: Implement vendor registration logic similar to registerUser
    res.status(501).json({ message: 'Vendor registration not implemented yet.' });
};

/**
 * Login an existing vendor.
 * @route POST /api/auth/vendor/login
 */
exports.loginVendor = async (req, res) => {
    // TODO: Implement vendor login logic similar to loginUser
    res.status(501).json({ message: 'Vendor login not implemented yet.' });
};
