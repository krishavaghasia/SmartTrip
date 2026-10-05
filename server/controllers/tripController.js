/**
 * SmartTrip - Trip Controller
 * Manages full CRUD operations for user trips, saved itineraries, and dashboard statistics.
 */

const db = require('../db');

async function createTrip(req, res) {
  try {
    const userId = req.user ? req.user.user_id : (req.body.user_id || 1);
    const {
      destination_id,
      title,
      start_date,
      end_date,
      budget,
      travelers,
      transport,
      starting_location,
      trip_score,
      preferences,
      itinerary,
      expenses
    } = req.body;

    if (!destination_id || !start_date || !end_date || !budget) {
      return res.status(400).json({ success: false, message: 'Missing required trip parameters.' });
    }

    const dest = await db.getDestinationById(destination_id);
    const tripTitle = title || `${dest ? dest.name : 'Destination'} Adventure`;

    // Format preferences array
    const prefList = [];
    if (preferences) {
      if (Array.isArray(preferences)) {
        preferences.forEach(p => prefList.push({ category: p.category, weight: p.weight || 8 }));
      } else if (typeof preferences === 'object') {
        for (const [cat, w] of Object.entries(preferences)) {
          prefList.push({ category: cat, weight: w });
        }
      }
    }

    // Format itinerary items
    const itinList = Array.isArray(itinerary) ? itinerary : [];

    // Format expenses
    const expList = Array.isArray(expenses) ? expenses : [];

    const tripId = await db.createTrip(
      {
        user_id: userId,
        destination_id,
        title: tripTitle,
        start_date,
        end_date,
        budget,
        travelers: travelers || 1,
        transport: transport || 'Public Transport',
        starting_location: starting_location || 'Hotel / City Center',
        trip_score: trip_score || 85
      },
      prefList,
      itinList,
      expList
    );

    res.status(201).json({
      success: true,
      message: 'Trip plan saved successfully!',
      trip_id: tripId
    });
  } catch (err) {
    console.error('createTrip error:', err);
    res.status(500).json({ success: false, message: 'Failed to save trip. ' + err.message });
  }
}

async function getTrips(req, res) {
  try {
    const userId = req.user ? req.user.user_id : 1;
    const trips = await db.getTripsByUserId(userId);
    res.json({
      success: true,
      count: trips.length,
      data: trips
    });
  } catch (err) {
    console.error('getTrips error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve trips.' });
  }
}

async function getTripById(req, res) {
  try {
    const trip = await db.getTripById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }

    // Group itinerary items by day for frontend rendering
    const dayMap = {};
    if (trip.itinerary && Array.isArray(trip.itinerary)) {
      trip.itinerary.forEach(item => {
        const d = item.day || 1;
        if (!dayMap[d]) {
          dayMap[d] = {
            day: d,
            activities: []
          };
        }
        dayMap[d].activities.push(item);
      });
    }

    const groupedDays = Object.values(dayMap).sort((a, b) => a.day - b.day);

    res.json({
      success: true,
      data: {
        ...trip,
        groupedDays
      }
    });
  } catch (err) {
    console.error('getTripById error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve trip.' });
  }
}

async function updateTrip(req, res) {
  try {
    const tripId = req.params.id;
    const allowed = ['title', 'budget', 'travelers', 'transport', 'starting_location', 'trip_score', 'start_date', 'end_date'];
    const updateData = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    const updated = await db.updateTrip(tripId, updateData);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Trip not found or no changes made.' });
    }

    res.json({ success: true, message: 'Trip updated successfully!' });
  } catch (err) {
    console.error('updateTrip error:', err);
    res.status(500).json({ success: false, message: 'Failed to update trip.' });
  }
}

async function deleteTrip(req, res) {
  try {
    const tripId = req.params.id;
    const deleted = await db.deleteTrip(tripId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }

    res.json({ success: true, message: 'Trip deleted successfully!' });
  } catch (err) {
    console.error('deleteTrip error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete trip.' });
  }
}

async function getStats(req, res) {
  try {
    const userId = req.user ? req.user.user_id : 1;
    const stats = await db.getUserStats(userId);
    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    console.error('getStats error:', err);
    res.status(500).json({ success: false, message: 'Failed to load user statistics.' });
  }
}

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getStats
};
