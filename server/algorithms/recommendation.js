/**
 * ====================================================================
 * SmartTrip - Algorithm 1: Recommendation Engine
 * ====================================================================
 * 
 * Objective:
 * Calculates a multi-factor recommendation score for each destination place
 * based on user/group interests, popularity, budget, and time fit.
 * 
 * Formula:
 * Recommendation Score =
 *   Interest Match (0 - 4.0 pts)
 *   + Popularity Score (0 - 3.0 pts)
 *   + Budget Compatibility (0 - 1.5 pts)
 *   + Time Compatibility (0 - 1.5 pts)
 * Total Score = 0.0 to 10.0 scale (e.g. 9.2/10)
 */

function calculateRecommendationScore(place, userPreferences = {}, budgetPerDay = 2500, availableHours = 8) {
  let score = 0;
  const reasons = [];

  // 1. Interest Match (Weight: 40% -> Max 4.0 points)
  // Check if place category exists in user preferences
  const category = place.category;
  const prefWeight = userPreferences[category] !== undefined ? parseFloat(userPreferences[category]) : 0;

  if (prefWeight > 0) {
    // prefWeight is on a 1 - 10 scale
    const interestPoints = (prefWeight / 10) * 4.0;
    score += interestPoints;
    reasons.push(`Matches your ${category} interest (${prefWeight}/10 rating)`);
  } else {
    // Base exploratory points for variety
    score += 1.0;
  }

  // 2. Popularity Score (Weight: 30% -> Max 3.0 points)
  // place.popularity is on a 1 - 10 scale (e.g., 9.4)
  const popularity = parseFloat(place.popularity) || 7.5;
  const popularityPoints = (popularity / 10) * 3.0;
  score += popularityPoints;
  if (popularity >= 9.0) {
    reasons.push(`Top-rated landmark with ${popularity}/10 popularity rating`);
  }

  // 3. Budget Compatibility (Weight: 15% -> Max 1.5 points)
  // Compare place entry cost against user's daily budget
  const cost = parseFloat(place.cost) || 0;
  if (cost === 0) {
    score += 1.5;
    reasons.push('Free admission (100% budget friendly)');
  } else {
    const costRatio = cost / Math.max(budgetPerDay, 500);
    if (costRatio <= 0.15) {
      // Takes less than 15% of daily budget
      score += 1.5;
      reasons.push(`Low cost (₹${cost}) fits comfortably within your budget`);
    } else if (costRatio <= 0.35) {
      score += 1.0;
      reasons.push(`Reasonably priced (₹${cost})`);
    } else {
      score += 0.5;
    }
  }

  // 4. Time Compatibility (Weight: 15% -> Max 1.5 points)
  // Ensure place duration (e.g. 1.5 to 3 hours) fits nicely in day
  const duration = parseFloat(place.duration) || 2.0;
  if (duration <= 3.0 && duration <= (availableHours * 0.4)) {
    score += 1.5;
    reasons.push(`Fits optimal visiting duration (~${duration} hrs)`);
  } else if (duration <= (availableHours * 0.6)) {
    score += 1.0;
  } else {
    score += 0.5;
  }

  // Cap score between 1.0 and 10.0 and round to 1 decimal place
  const finalScore = Math.min(10.0, Math.max(1.0, Math.round(score * 10) / 10));

  return {
    score: finalScore,
    matchPercentage: Math.round((finalScore / 10) * 100),
    reasons: reasons.slice(0, 3) // Return top 3 compelling reasons
  };
}

/**
 * Rank a list of places based on user preferences and budget
 */
function rankPlaces(places, userPreferences = {}, budgetPerDay = 2500, availableHours = 8) {
  return places.map(place => {
    const analysis = calculateRecommendationScore(place, userPreferences, budgetPerDay, availableHours);
    return {
      ...place,
      recommendationScore: analysis.score,
      matchPercentage: analysis.matchPercentage,
      reasons: analysis.reasons
    };
  }).sort((a, b) => b.recommendationScore - a.recommendationScore);
}

module.exports = {
  calculateRecommendationScore,
  rankPlaces
};
