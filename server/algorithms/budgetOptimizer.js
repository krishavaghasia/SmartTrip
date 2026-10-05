/**
 * ====================================================================
 * SmartTrip - Algorithm 3: Budget Optimizer
 * ====================================================================
 * 
 * Objective:
 * Calculates estimated breakdown for Transportation, Accommodation, Food,
 * Activities, and Miscellaneous. Compares estimated total with user's budget.
 * If over-budget, generates smart cost-reduction suggestions.
 */

const TRANSPORT_DAILY_COSTS = {
  'Walking': 0,
  'Public Transport': 120, // Per person per day
  'Bike': 350,            // Per day
  'Car': 1200,            // Per day
  'Taxi': 900             // Per day
};

/**
 * Optimize and breakdown the trip budget
 * @param {Number} totalBudget - User's allocated budget in INR
 * @param {Number} days - Total duration in days
 * @param {Number} travelers - Number of travelers
 * @param {String} transportMode - Transportation preference
 * @param {Array} placesInItinerary - Array of visited place objects
 * @param {Array} availableDestinationPlaces - All available places to find cheaper alternatives
 */
function analyzeBudget(totalBudget, days, travelers = 1, transportMode = 'Public Transport', placesInItinerary = [], availableDestinationPlaces = []) {
  const budget = Math.max(parseFloat(totalBudget) || 3000, 500);
  const tripDays = Math.max(parseInt(days, 10) || 1, 1);
  const numTravelers = Math.max(parseInt(travelers, 10) || 1, 1);

  // 1. Calculate Activity Costs (Sum of place costs * travelers)
  let activitiesCost = 0;
  placesInItinerary.forEach(place => {
    const cost = parseFloat(place.cost) || 0;
    activitiesCost += (cost * numTravelers);
  });

  // 2. Calculate Transportation Cost
  let transportCost = 0;
  if (transportMode === 'Walking') {
    transportCost = 0;
  } else if (transportMode === 'Public Transport') {
    transportCost = TRANSPORT_DAILY_COSTS['Public Transport'] * numTravelers * tripDays;
  } else {
    // Vehicle rental or taxi rate (shared across travelers)
    transportCost = (TRANSPORT_DAILY_COSTS[transportMode] || 800) * tripDays;
  }

  // 3. Calculate Accommodation Cost (~30% to 35% of budget, or standard room calculation)
  // Assuming 1 room per 2 travelers
  const roomsNeeded = Math.ceil(numTravelers / 2);
  const estimatedRoomRate = Math.min(Math.max((budget * 0.35) / (tripDays * roomsNeeded), 1000), 3000);
  const accommodationCost = Math.round(roomsNeeded * estimatedRoomRate * Math.max(tripDays - 1, 1));

  // 4. Calculate Food Cost (₹400-600/person/day)
  const foodPerPersonPerDay = 500;
  const foodCost = foodPerPersonPerDay * numTravelers * tripDays;

  // 5. Calculate Miscellaneous (Emergency, water, souvenirs - ~5% of budget)
  const miscCost = Math.round(budget * 0.05);

  // Total Estimated Expense
  const estimatedTotal = Math.round(transportCost + accommodationCost + foodCost + activitiesCost + miscCost);
  const difference = budget - estimatedTotal;
  const isOverBudget = difference < 0;
  const deficit = isOverBudget ? Math.abs(difference) : 0;
  const remainingBudget = isOverBudget ? 0 : difference;

  // Percentage of budget utilized
  const utilizationPercentage = Math.min(100, Math.round((estimatedTotal / budget) * 100));

  // Generate Smart Budget Saving Suggestions if over budget
  const suggestions = [];
  if (isOverBudget && placesInItinerary.length > 0) {
    // Find highest cost places in the current itinerary
    const paidPlaces = placesInItinerary
      .filter(p => parseFloat(p.cost) > 0)
      .sort((a, b) => parseFloat(b.cost) - parseFloat(a.cost));

    if (paidPlaces.length > 0) {
      const expensivePlace = paidPlaces[0];
      const expensiveCost = parseFloat(expensivePlace.cost) * numTravelers;

      // Search for a lower-cost or free alternative in the same destination
      const visitedIds = new Set(placesInItinerary.map(p => p.place_id));
      const alternative = availableDestinationPlaces.find(p => 
        !visitedIds.has(p.place_id) && 
        parseFloat(p.cost) < parseFloat(expensivePlace.cost)
      );

      if (alternative) {
        const altCost = (parseFloat(alternative.cost) || 0) * numTravelers;
        const saving = expensiveCost - altCost;
        suggestions.push({
          type: 'activity_replacement',
          message: `Replace "${expensivePlace.name}" (₹${expensiveCost}) with "${alternative.name}" (₹${altCost}).`,
          estimatedSaving: saving,
          originalPlace: expensivePlace.name,
          suggestedPlace: alternative.name
        });
      }
    }

    if (transportMode === 'Taxi' || transportMode === 'Car') {
      const publicCost = TRANSPORT_DAILY_COSTS['Public Transport'] * numTravelers * tripDays;
      const transportSaving = transportCost - publicCost;
      if (transportSaving > 0) {
        suggestions.push({
          type: 'transport_switch',
          message: `Switch from ${transportMode} to Metro / Public Transport.`,
          estimatedSaving: transportSaving
        });
      }
    }

    suggestions.push({
      type: 'food_optimization',
      message: 'Opt for authentic local street dining instead of fine-dining restaurants to save on meals.',
      estimatedSaving: Math.round(foodCost * 0.25)
    });
  } else {
    suggestions.push({
      type: 'budget_healthy',
      message: `Your travel plan is well within your budget! You have ₹${remainingBudget} remaining for shopping and souvenirs.`
    });
  }

  return {
    totalBudget: budget,
    estimatedTotal,
    remainingBudget,
    isOverBudget,
    deficit,
    utilizationPercentage,
    breakdown: {
      transportation: Math.round(transportCost),
      accommodation: Math.round(accommodationCost),
      food: Math.round(foodCost),
      activities: Math.round(activitiesCost),
      miscellaneous: Math.round(miscCost)
    },
    suggestions
  };
}

module.exports = {
  analyzeBudget
};
