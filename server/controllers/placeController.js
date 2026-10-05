/**
 * SmartTrip - Place Controller
 * Supports dynamic searching, category filtering, cost limits, and indoor/outdoor filters.
 */

const db = require('../db');

async function getPlaces(req, res) {
  try {
    const filters = {
      destination_id: req.query.destination_id,
      category: req.query.category,
      max_cost: req.query.max_cost,
      indoor_outdoor: req.query.indoor_outdoor,
      min_popularity: req.query.min_popularity,
      search: req.query.search
    };

    const places = await db.getPlaces(filters);
    res.json({
      success: true,
      count: places.length,
      data: places
    });
  } catch (err) {
    console.error('getPlaces error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve places.' });
  }
}

async function getPlaceById(req, res) {
  try {
    const place = await db.getPlaceById(req.params.id);
    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found.' });
    }
    res.json({
      success: true,
      data: place
    });
  } catch (err) {
    console.error('getPlaceById error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve place details.' });
  }
}

module.exports = {
  getPlaces,
  getPlaceById
};
