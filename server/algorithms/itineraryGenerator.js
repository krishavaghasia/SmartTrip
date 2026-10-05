/**
 * ====================================================================
 * SmartTrip - Master Itinerary Generator
 * ====================================================================
 * 
 * Objective:
 * Orchestrates Recommendation Engine, Route Optimizer, Budget Optimizer,
 * and Trip Scorer to generate an optimized, realistic day-by-day travel plan.
 * 
 * Supports:
 * - Standard multi-interest trips
 * - Group aggregated preferences
 * - Rainy Day / Alternative indoor itineraries
 */

const { rankPlaces } = require('./recommendation');
const { optimizeRoute } = require('./routeOptimizer');
const { analyzeBudget } = require('./budgetOptimizer');
const { scoreTrip } = require('./tripScorer');

// Standard daily time slots for realistic pacing
const TIME_SLOTS = [
  { start: '09:00:00', end: '11:00:00', period: 'Morning Exploration' },
  { start: '11:30:00', end: '13:00:00', period: 'Late Morning Visit' },
  { start: '14:30:00', end: '17:00:00', period: 'Afternoon Discovery' },
  { start: '17:30:00', end: '19:30:00', period: 'Sunset & Scenic Walk' },
  { start: '19:30:00', end: '21:30:00', period: 'Evening Dining & Leisure' }
];

/**
 * Generate a complete smart itinerary
 */
function generateItinerary({
  destination,
  places = [],
  days = 2,
  budget = 5000,
  travelers = 1,
  transport = 'Public Transport',
  startingLocation = 'Hotel / City Center',
  preferences = {},
  isRainyDay = false
}) {
  const numDays = Math.min(Math.max(parseInt(days, 10) || 1, 1), 7);
  const totalBudget = Math.max(parseFloat(budget) || 3000, 500);
  const dailyBudget = totalBudget / numDays;
  const numTravelers = Math.max(parseInt(travelers, 10) || 1, 1);

  // 1. Filter places for Rainy Day / Alternative Itinerary if requested
  let candidatePlaces = [...places];
  if (isRainyDay) {
    // Prioritize indoor and mixed places
    const indoorPlaces = places.filter(p => p.indoor_outdoor === 'indoor' || p.indoor_outdoor === 'mixed');
    if (indoorPlaces.length >= numDays * 2) {
      candidatePlaces = indoorPlaces;
    }
  }

  // 2. Rank candidate places using Recommendation Engine
  const ranked = rankPlaces(candidatePlaces, preferences, dailyBudget, 8);

  // 3. Determine how many places to visit per day (usually 3 to 4)
  const placesPerDay = Math.min(4, Math.max(2, Math.floor(ranked.length / numDays)));
  const totalPlacesNeeded = Math.min(ranked.length, numDays * placesPerDay);
  const selectedPlaces = ranked.slice(0, totalPlacesNeeded);

  // 4. Distribute places across days
  const daysPlan = [];
  const allItineraryItems = [];
  let placeCursor = 0;

  let grandTotalDistanceKm = 0;
  let grandTotalTravelMins = 0;

  for (let dayNum = 1; dayNum <= numDays; dayNum++) {
    // Get places allocated for this day
    const dayPlaces = selectedPlaces.slice(placeCursor, placeCursor + placesPerDay);
    placeCursor += placesPerDay;

    if (dayPlaces.length === 0) continue;

    // 5. Optimize route for this day using Nearest Neighbor algorithm
    const routeResult = optimizeRoute(
      dayPlaces,
      { name: startingLocation, latitude: dayPlaces[0].latitude, longitude: dayPlaces[0].longitude },
      transport
    );

    grandTotalDistanceKm += routeResult.totalDistanceKm;
    grandTotalTravelMins += routeResult.estimatedTimeMinutes;

    // 6. Assign time slots to ordered places
    const scheduledItems = routeResult.orderedPlaces.map((place, idx) => {
      const slot = TIME_SLOTS[idx % TIME_SLOTS.length];
      const item = {
        day: dayNum,
        sequence: idx + 1,
        place_id: place.place_id,
        place,
        start_time: slot.start,
        end_time: slot.end,
        period: slot.period,
        notes: place.reasons && place.reasons[0] ? place.reasons[0] : `${place.category} visit`
      };
      allItineraryItems.push(item);
      return item;
    });

    daysPlan.push({
      day: dayNum,
      title: `Day ${dayNum} - ${dayPlaces[0].category} & City Discovery`,
      activities: scheduledItems,
      dayRoute: {
        distanceKm: routeResult.totalDistanceKm,
        travelTime: routeResult.formattedTime,
        legs: routeResult.legs
      }
    });
  }

  // 7. Calculate Budget Analysis
  const budgetAnalysis = analyzeBudget(
    totalBudget,
    numDays,
    numTravelers,
    transport,
    selectedPlaces,
    places
  );

  // 8. Overall Route Analysis
  const overallHours = Math.floor(grandTotalTravelMins / 60);
  const overallMins = grandTotalTravelMins % 60;
  const overallRouteAnalysis = {
    totalDistanceKm: Math.round(grandTotalDistanceKm * 10) / 10,
    totalTravelMinutes: grandTotalTravelMins,
    formattedTotalTime: overallHours > 0 ? `${overallHours} hr ${overallMins} min` : `${overallMins} min`,
    transportMode: transport
  };

  // 9. Calculate Overall Trip Score
  const tripScoreResult = scoreTrip(
    allItineraryItems,
    budgetAnalysis,
    overallRouteAnalysis,
    preferences
  );

  return {
    isRainyDayPlan: !!isRainyDay,
    destination: destination || { name: 'Your Destination' },
    days: numDays,
    travelers: numTravelers,
    budget: totalBudget,
    transport,
    startingLocation,
    daysPlan,
    itineraryItems: allItineraryItems,
    budgetAnalysis,
    routeAnalysis: overallRouteAnalysis,
    tripScore: tripScoreResult.tripScore,
    scoreMetrics: tripScoreResult.metrics,
    smartSuggestions: tripScoreResult.smartSuggestions,
    recommendedPlaces: ranked.slice(0, 6) // top recommendations for user to inspect
  };
}

module.exports = {
  generateItinerary
};
