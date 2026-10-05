/**
 * SmartTrip - Algorithm Controller
 * Exposes core intelligent algorithms via REST endpoints:
 * 1. Itinerary Generator (Multi-day, personalized, route-optimized)
 * 2. Route Optimizer (Nearest Neighbor TSP)
 * 3. Recommendation Engine (Multi-criteria scoring)
 * 4. Group Travel Preference Calculator
 * 5. Budget Optimizer & Savings Suggestions
 * 6. Rainy Day / Alternative Plan Generator
 */

const db = require('../db');
const { generateItinerary } = require('../algorithms/itineraryGenerator');
const { optimizeRoute } = require('../algorithms/routeOptimizer');
const { rankPlaces, calculateRecommendationScore } = require('../algorithms/recommendation');
const { calculateGroupPreferences } = require('../algorithms/groupPreferences');
const { analyzeBudget } = require('../algorithms/budgetOptimizer');
const { scoreTrip } = require('../algorithms/tripScorer');

/**
 * POST /api/generate-itinerary
 * Main entry point for intelligent trip generation
 */
async function generateItineraryPlan(req, res) {
  try {
    const {
      destination_id,
      start_date,
      end_date,
      days,
      budget,
      travelers,
      transport,
      starting_location,
      preferences,
      group_travelers,
      is_rainy_day
    } = req.body;

    if (!destination_id) {
      return res.status(400).json({ success: false, message: 'Please select a destination.' });
    }

    const destination = await db.getDestinationById(destination_id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found.' });
    }

    // Determine number of days
    let tripDays = parseInt(days, 10);
    if (!tripDays && start_date && end_date) {
      const start = new Date(start_date);
      const end = new Date(end_date);
      tripDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
    }
    tripDays = Math.min(Math.max(tripDays || 2, 1), 7);

    // Calculate effective preferences (check if group preferences provided)
    let finalPreferences = preferences || {};
    let groupSummary = null;

    if (group_travelers && Array.isArray(group_travelers) && group_travelers.length > 1) {
      const groupResult = calculateGroupPreferences(group_travelers);
      finalPreferences = groupResult.combinedPreferences;
      groupSummary = groupResult;
    }

    // Fetch places for this destination
    const allPlaces = await db.getPlaces({ destination_id });
    if (!allPlaces || allPlaces.length === 0) {
      return res.status(404).json({ success: false, message: 'No places found for this destination.' });
    }

    // Run master generator
    const generatedPlan = generateItinerary({
      destination,
      places: allPlaces,
      days: tripDays,
      budget: parseFloat(budget) || 5000,
      travelers: parseInt(travelers, 10) || 1,
      transport: transport || 'Public Transport',
      startingLocation: starting_location || `${destination.name} City Center`,
      preferences: finalPreferences,
      isRainyDay: !!is_rainy_day
    });

    res.json({
      success: true,
      message: is_rainy_day 
        ? 'Rainy Day / Alternative indoor plan generated successfully!' 
        : 'Smart itinerary generated successfully!',
      data: {
        ...generatedPlan,
        groupSummary
      }
    });
  } catch (err) {
    console.error('generateItineraryPlan error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate itinerary. ' + err.message });
  }
}

/**
 * POST /api/optimize-route
 * Reorders a list of places using Nearest Neighbor TSP algorithm
 */
async function optimizeRouteEndpoint(req, res) {
  try {
    const { places, starting_location, transport } = req.body;

    if (!places || !Array.isArray(places) || places.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide a list of places to optimize.' });
    }

    const startPoint = starting_location && starting_location.latitude && starting_location.longitude
      ? starting_location
      : (places[0] ? { name: places[0].name, latitude: places[0].latitude, longitude: places[0].longitude } : null);

    const result = optimizeRoute(places, startPoint, transport || 'Public Transport');

    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error('optimizeRouteEndpoint error:', err);
    res.status(500).json({ success: false, message: 'Failed to optimize route.' });
  }
}

/**
 * POST /api/group-preferences
 * Aggregates group preferences and returns normalized weights
 */
async function calculateGroupPreferencesEndpoint(req, res) {
  try {
    const { travelers } = req.body;

    if (!travelers || !Array.isArray(travelers) || travelers.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide traveler preferences array.' });
    }

    const result = calculateGroupPreferences(travelers);

    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error('calculateGroupPreferencesEndpoint error:', err);
    res.status(500).json({ success: false, message: 'Failed to calculate group preferences.' });
  }
}

/**
 * GET /api/recommendations
 * Returns scored recommendations for a destination
 */
async function getRecommendationsEndpoint(req, res) {
  try {
    const { destination_id, budget, preferences } = req.query;

    if (!destination_id) {
      return res.status(400).json({ success: false, message: 'destination_id is required.' });
    }

    let prefMap = {};
    if (preferences) {
      try {
        prefMap = JSON.parse(preferences);
      } catch (e) {
        prefMap = {};
      }
    }

    const places = await db.getPlaces({ destination_id });
    const dailyBudget = (parseFloat(budget) || 5000) / 2;
    const ranked = rankPlaces(places, prefMap, dailyBudget, 8);

    res.json({
      success: true,
      count: ranked.length,
      data: ranked
    });
  } catch (err) {
    console.error('getRecommendationsEndpoint error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch recommendations.' });
  }
}

/**
 * POST /api/budget-optimize
 * Analyzes budget breakdown and provides savings suggestions
 */
async function analyzeBudgetEndpoint(req, res) {
  try {
    const { total_budget, days, travelers, transport, places, destination_id } = req.body;

    let destinationPlaces = [];
    if (destination_id) {
      destinationPlaces = await db.getPlaces({ destination_id });
    }

    const result = analyzeBudget(
      total_budget || 5000,
      days || 2,
      travelers || 1,
      transport || 'Public Transport',
      places || [],
      destinationPlaces
    );

    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error('analyzeBudgetEndpoint error:', err);
    res.status(500).json({ success: false, message: 'Failed to analyze budget.' });
  }
}

module.exports = {
  generateItineraryPlan,
  optimizeRouteEndpoint,
  calculateGroupPreferencesEndpoint,
  getRecommendationsEndpoint,
  analyzeBudgetEndpoint
};
