/**
 * ====================================================================
 * SmartTrip - Algorithm 5: Trip Scorer
 * ====================================================================
 * 
 * Objective:
 * Evaluates the quality, feasibility, and optimization of an itinerary.
 * Produces an overall Trip Score (0-100) and scores for 4 core pillars:
 * 1. Budget Efficiency (25 pts)
 * 2. Preference Match (25 pts)
 * 3. Route Efficiency (25 pts)
 * 4. Time Utilization (25 pts)
 * 
 * Also generates contextual Smart Suggestions.
 */

/**
 * Score the trip based on itinerary details and optimization results
 */
function scoreTrip(itinerary = [], budgetAnalysis = {}, routeAnalysis = {}, preferences = {}) {
  const suggestions = [];

  // 1. Budget Efficiency Score (0 to 25 points)
  let budgetScore = 20; // Default baseline
  if (budgetAnalysis) {
    if (budgetAnalysis.isOverBudget) {
      // Penalty proportional to deficit
      const deficitRatio = budgetAnalysis.deficit / budgetAnalysis.totalBudget;
      budgetScore = Math.max(8, Math.round(25 * (1 - deficitRatio)));
      suggestions.push(`Your itinerary exceeds your budget by ₹${budgetAnalysis.deficit}. Consider replacing expensive activities.`);
    } else {
      const remainingRatio = budgetAnalysis.remainingBudget / budgetAnalysis.totalBudget;
      if (remainingRatio >= 0.05 && remainingRatio <= 0.25) {
        budgetScore = 25; // Ideal budget utilization (with 5-25% buffer)
      } else if (remainingRatio > 0.25) {
        budgetScore = 22; // Under-utilized budget
        suggestions.push(`You have ₹${budgetAnalysis.remainingBudget} unspent budget. You could add another exciting activity or premium dining!`);
      } else {
        budgetScore = 23; // Almost exact match
      }
    }
  }

  // 2. Preference Match Score (0 to 25 points)
  let prefScore = 21;
  if (itinerary.length > 0) {
    let matchSum = 0;
    itinerary.forEach(item => {
      const placeCategory = item.place ? item.place.category : item.category;
      const weight = preferences[placeCategory] ? parseFloat(preferences[placeCategory]) : 5.0;
      matchSum += (weight / 10);
    });
    const avgMatch = matchSum / itinerary.length;
    prefScore = Math.round(avgMatch * 25);
  }

  // 3. Route Efficiency Score (0 to 25 points)
  let routeScore = 22;
  const totalDist = routeAnalysis.totalDistanceKm || 0;
  const placesCount = itinerary.length;
  if (placesCount > 1) {
    const avgDistanceBetweenStops = totalDist / (placesCount - 1);
    if (avgDistanceBetweenStops <= 5.0) {
      routeScore = 25; // Very compact, minimal travel
    } else if (avgDistanceBetweenStops <= 12.0) {
      routeScore = 22; // Moderate travel
    } else if (avgDistanceBetweenStops <= 25.0) {
      routeScore = 18;
      suggestions.push('Locations are somewhat spread out. Organizing by neighborhood reduces travel time.');
    } else {
      routeScore = 14;
      suggestions.push('Significant transit distance detected between places. Moving distant stops to different days will save travel time.');
    }
  }

  // 4. Time Utilization Score (0 to 25 points)
  let timeScore = 22;
  // Check activities per day (3 to 4 is ideal)
  const daysMap = {};
  itinerary.forEach(item => {
    const d = item.day || 1;
    daysMap[d] = (daysMap[d] || 0) + 1;
  });
  const daysCount = Object.keys(daysMap).length || 1;
  const avgActivitiesPerDay = itinerary.length / daysCount;

  if (avgActivitiesPerDay >= 3 && avgActivitiesPerDay <= 4.5) {
    timeScore = 24; // Perfect pacing
  } else if (avgActivitiesPerDay > 4.5) {
    timeScore = 18;
    suggestions.push('Day schedule is packed. Consider spreading activities to allow free time and relaxation.');
  } else {
    timeScore = 20;
    suggestions.push(`You have roughly 2 to 3 hours of free leisure time each day for relaxed exploring or resting.`);
  }

  // Total Trip Score out of 100
  const totalScore = Math.min(100, Math.max(40, budgetScore + prefScore + routeScore + timeScore));

  return {
    tripScore: totalScore,
    metrics: {
      budgetEfficiency: {
        score: budgetScore,
        max: 25,
        percentage: Math.round((budgetScore / 25) * 100)
      },
      preferenceMatch: {
        score: prefScore,
        max: 25,
        percentage: Math.round((prefScore / 25) * 100)
      },
      routeEfficiency: {
        score: routeScore,
        max: 25,
        percentage: Math.round((routeScore / 25) * 100)
      },
      timeUtilization: {
        score: timeScore,
        max: 25,
        percentage: Math.round((timeScore / 25) * 100)
      }
    },
    smartSuggestions: suggestions.length > 0 ? suggestions : [
      'Your itinerary is well-balanced across budget, travel routes, and personal interests!'
    ]
  };
}

module.exports = {
  scoreTrip
};
