/**
 * SmartTrip - Authentication Middleware
 * Validates JWT tokens and secures private API routes.
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'smarttrip_secret_key_btech_cse_2026';

function requireAuth(req, res, next) {
  let token = null;

  const authHeader = req.headers['authorization'] || req.headers['x-auth-token'];
  if (authHeader) {
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      token = authHeader;
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please log in to continue.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session. Please log in again.'
    });
  }
}

function optionalAuth(req, res, next) {
  let token = null;
  const authHeader = req.headers['authorization'] || req.headers['x-auth-token'];
  if (authHeader) {
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      token = authHeader;
    }
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      // Ignore invalid token for optional endpoints
    }
  }
  next();
}

module.exports = {
  requireAuth,
  optionalAuth,
  JWT_SECRET
};
