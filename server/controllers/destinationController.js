/**
 * SmartTrip - Destination Controller
 * Manages destination listings and details.
 */

const db = require('../db');

async function getDestinations(req, res) {
  try {
    const destinations = await db.getDestinations();
    res.json({
      success: true,
      count: destinations.length,
      data: destinations
    });
  } catch (err) {
    console.error('getDestinations error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve destinations.' });
  }
}

async function getDestinationById(req, res) {
  try {
    const destination = await db.getDestinationById(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found.' });
    }

    const places = await db.getPlaces({ destination_id: req.params.id });

    res.json({
      success: true,
      data: {
        ...destination,
        places
      }
    });
  } catch (err) {
    console.error('getDestinationById error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve destination.' });
  }
}

module.exports = {
  getDestinations,
  getDestinationById
};
