/**
 * SmartTrip - Auth Controller
 * Handles user registration, login, and profile fetching.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { JWT_SECRET } = require('../middleware/auth');

async function register(req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    // Check existing email
    const existing = await db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    // Generate JWT
    const token = jwt.sign(
      { user_id: newUser.user_id, email: newUser.email, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to SmartTrip.',
      token,
      user: {
        user_id: newUser.user_id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration. Please try again.' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both email and password.' });
    }

    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Verify password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful! Welcome back.',
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ success: false, message: 'Server error during login. Please try again.' });
  }
}

async function getMe(req, res) {
  try {
    const user = await db.findUserById(req.user.user_id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error('GetMe Error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch user profile.' });
  }
}

module.exports = {
  register,
  login,
  getMe
};
