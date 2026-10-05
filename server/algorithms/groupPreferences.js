/**
 * ====================================================================
 * SmartTrip - Algorithm 4: Group Travel Preference System
 * ====================================================================
 * 
 * Objective:
 * Aggregates interests from multiple travelers in a group, calculating a
 * balanced, unified preference vector that reflects the group's collective choices.
 * 
 * Concept:
 * - Each traveler selects 1 to 5 interests (or rates them 1 to 10).
 * - The system accumulates frequencies and weights per category.
 * - Normalized to a 1.0 - 10.0 scale so every group member's voice is represented.
 */

const ALL_CATEGORIES = [
  'Nature',
  'History',
  'Adventure',
  'Food',
  'Shopping',
  'Photography',
  'Culture',
  'Religious',
  'Nightlife',
  'Relaxation'
];

/**
 * Calculate combined group preferences
 * @param {Array} travelersList - Array of { name: 'Traveler 1', interests: ['History', 'Food'] }
 *                                OR { name: 'Traveler 1', weights: { History: 9, Food: 8 } }
 */
function calculateGroupPreferences(travelersList = []) {
  if (!travelersList || travelersList.length === 0) {
    // Default balanced preferences
    const defaultMap = {};
    ALL_CATEGORIES.forEach(cat => { defaultMap[cat] = 5.0; });
    return {
      combinedPreferences: defaultMap,
      rankedInterests: ALL_CATEGORIES.map(cat => ({ category: cat, score: 5.0 })),
      totalTravelers: 0
    };
  }

  const categoryScores = {};
  ALL_CATEGORIES.forEach(cat => { categoryScores[cat] = 0; });

  const totalMembers = travelersList.length;

  travelersList.forEach(traveler => {
    if (traveler.weights) {
      // Numerical weights provided
      for (const [cat, w] of Object.entries(traveler.weights)) {
        if (categoryScores[cat] !== undefined) {
          categoryScores[cat] += parseFloat(w) || 0;
        }
      }
    } else if (traveler.interests) {
      const travelerInterests = Array.isArray(traveler.interests)
        ? traveler.interests
        : (typeof traveler.interests === 'string' ? traveler.interests.split(',').map(s => s.trim()) : []);

      travelerInterests.forEach(cat => {
        const matchedCat = ALL_CATEGORIES.find(c => c.toLowerCase() === (cat || '').trim().toLowerCase());
        if (matchedCat) {
          categoryScores[matchedCat] += 10;
        }
      });
    }
  });

  // Normalize scores to a 1.0 - 10.0 scale
  const combinedMap = {};
  const ranked = [];

  ALL_CATEGORIES.forEach(cat => {
    // Fraction of travelers who selected this category (0.0 to 1.0)
    const selectionCount = categoryScores[cat] / 10;
    let normalized = 2.0; // Baseline for unselected

    if (selectionCount > 0) {
      const fraction = selectionCount / totalMembers;
      // Scales from 6.0 (at least one traveler chose it) up to 10.0 (all chose it)
      normalized = 5.5 + (fraction * 4.5);
    }

    normalized = Math.min(10.0, Math.max(1.0, Math.round(normalized * 10) / 10));
    combinedMap[cat] = normalized;
    ranked.push({
      category: cat,
      score: normalized,
      percentage: Math.round((normalized / 10) * 100)
    });
  });

  ranked.sort((a, b) => b.score - a.score);

  return {
    combinedPreferences: combinedMap,
    rankedInterests: ranked,
    totalTravelers: totalMembers
  };
}

module.exports = {
  calculateGroupPreferences,
  ALL_CATEGORIES
};
