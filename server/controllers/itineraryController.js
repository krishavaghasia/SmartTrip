/**
 * SmartTrip - Itinerary Item Controller
 * Handles granular activity modifications: adding, editing times, deleting, and reordering.
 */

const db = require('../db');

async function addItineraryItem(req, res) {
  try {
    const { trip_id, day, place_id, start_time, end_time, sequence, notes } = req.body;

    if (!trip_id || !day || !place_id || !start_time || !end_time) {
      return res.status(400).json({ success: false, message: 'Missing required itinerary fields.' });
    }

    const newId = await db.addItineraryItem({
      trip_id,
      day,
      place_id,
      start_time,
      end_time,
      sequence: sequence || 1,
      notes: notes || ''
    });

    const place = await db.getPlaceById(place_id);

    res.status(201).json({
      success: true,
      message: 'Activity added to itinerary!',
      data: {
        itinerary_id: newId,
        trip_id,
        day,
        place_id,
        start_time,
        end_time,
        sequence: sequence || 1,
        notes,
        place
      }
    });
  } catch (err) {
    console.error('addItineraryItem error:', err);
    res.status(500).json({ success: false, message: 'Failed to add activity to itinerary.' });
  }
}

async function updateItineraryItem(req, res) {
  try {
    const itemId = req.params.id;
    const allowed = ['start_time', 'end_time', 'sequence', 'notes', 'day'];
    const updateData = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    const updated = await db.updateItineraryItem(itemId, updateData);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Itinerary item not found.' });
    }

    res.json({
      success: true,
      message: 'Itinerary item updated successfully!'
    });
  } catch (err) {
    console.error('updateItineraryItem error:', err);
    res.status(500).json({ success: false, message: 'Failed to update itinerary item.' });
  }
}

async function deleteItineraryItem(req, res) {
  try {
    const itemId = req.params.id;
    const deleted = await db.deleteItineraryItem(itemId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Itinerary item not found.' });
    }

    res.json({
      success: true,
      message: 'Activity removed from itinerary!'
    });
  } catch (err) {
    console.error('deleteItineraryItem error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete itinerary item.' });
  }
}

module.exports = {
  addItineraryItem,
  updateItineraryItem,
  deleteItineraryItem
};
