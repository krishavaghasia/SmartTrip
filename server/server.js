/**
 * ====================================================================
 * SmartTrip - Intelligent Travel Itinerary Planner
 * Open Source Technologies (OST) Innovative Assignment
 * Main Express Application Server
 * ====================================================================
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./db');

// Route Handlers
const authRoutes = require('./routes/auth');
const destinationRoutes = require('./routes/destinations');
const placeRoutes = require('./routes/places');
const tripRoutes = require('./routes/trips');
const itineraryRoutes = require('./routes/itinerary');
const algorithmRoutes = require('./routes/algorithms');

// Direct Controller references for convenient alias routes specified in specification
const authController = require('./controllers/authController');
const algorithmController = require('./controllers/algorithmController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from /public
app.use(express.static(path.join(__dirname, '../public')));

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api', algorithmRoutes);

// Direct Specification Alias Endpoints
app.post('/api/register', authController.register);
app.post('/api/login', authController.login);

// Health & System Status Endpoint (Great for Viva Demonstrations!)
app.get('/api/health', async (req, res) => {
  const isMysqlConnected = db.checkConnection();
  const destinations = await db.getDestinations();
  const places = await db.getPlaces();

  res.json({
    status: 'ONLINE',
    system: 'SmartTrip – Intelligent Travel Itinerary Planner',
    database: {
      engine: isMysqlConnected ? 'MySQL 8.0 (Live Pool)' : 'In-Memory Resilient Store',
      status: isMysqlConnected ? 'CONNECTED' : 'FALLBACK_ACTIVE',
      destinations_loaded: destinations.length,
      places_loaded: places.length
    },
    uptime: Math.round(process.uptime()) + ' seconds',
    timestamp: new Date().toISOString()
  });
});

// Single Page Application Fallback for Clean URLs
app.get('*', (req, res) => {
  // If request is not an API call and doesn't have an extension, try to serve HTML
  if (!req.path.startsWith('/api')) {
    const requestedFile = req.path === '/' ? 'index.html' : req.path.replace(/^\//, '');
    const filePath = path.join(__dirname, '../public', requestedFile.endsWith('.html') ? requestedFile : `${requestedFile}.html`);
    res.sendFile(filePath, err => {
      if (err) {
        res.sendFile(path.join(__dirname, '../public/index.html'));
      }
    });
  } else {
    res.status(404).json({ success: false, message: 'API endpoint not found.' });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Server Initialization
async function startServer() {
  console.log('----------------------------------------------------');
  console.log('🚀 Starting SmartTrip Web Server...');
  console.log('----------------------------------------------------');

  // Attempt database connection
  await db.initDb();

  app.listen(PORT, () => {
    console.log(`\n====================================================`);
    console.log(` SmartTrip Server running on: http://localhost:${PORT}`);
    console.log(` Landing Page:                http://localhost:${PORT}/index.html`);
    console.log(` Create Trip Wizard:          http://localhost:${PORT}/create-trip.html`);
    console.log(` Dashboard:                   http://localhost:${PORT}/dashboard.html`);
    console.log(` System Health & Diagnostics: http://localhost:${PORT}/api/health`);
    console.log(`====================================================\n`);
  });
}

startServer();
