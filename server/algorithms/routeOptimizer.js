/**
 * ====================================================================
 * SmartTrip - Algorithm 2: Route Optimization (Nearest Neighbor)
 * ====================================================================
 * 
 * Objective:
 * Minimizes unnecessary back-and-forth travel between attractions by ordering
 * locations using the Nearest Neighbor heuristic based on Haversine distance.
 * 
 * Concept:
 * 1. Calculate great-circle distance between geographic coordinates (lat/long)
 *    using the Haversine formula.
 * 2. Start from an origin point (or the first place).
 * 3. At each step, pick the closest unvisited place.
 * 4. Compute total travel distance and estimated transit time based on transport mode.
 */

// Average urban travel speeds in km/h
const TRANSPORT_SPEEDS = {
  'Walking': 4.5,
  'Public Transport': 22.0,
  'Bike': 25.0,
  'Car': 30.0,
  'Taxi': 28.0
};

/**
 * Calculate distance between two lat/long points in Kilometers
 * using the Haversine formula
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // 1 decimal place
}

/**
 * Optimize route for a list of places using Nearest Neighbor TSP algorithm
 * @param {Array} places - Array of place objects with latitude and longitude
 * @param {Object} startPoint - Optional { latitude, longitude, name }
 * @param {String} transportMode - e.g. 'Walking', 'Car', 'Public Transport'
 */
function optimizeRoute(places, startPoint = null, transportMode = 'Public Transport') {
  if (!places || places.length <= 1) {
    return {
      orderedPlaces: places || [],
      totalDistanceKm: 0,
      estimatedTimeMinutes: 0,
      formattedTime: '0 min',
      legs: []
    };
  }

  const unvisited = [...places];
  const orderedPlaces = [];
  const legs = [];

  // Determine starting point
  let currentLat, currentLon, currentName;
  if (startPoint && startPoint.latitude && startPoint.longitude) {
    currentLat = parseFloat(startPoint.latitude);
    currentLon = parseFloat(startPoint.longitude);
    currentName = startPoint.name || 'Starting Point';

    // If startPoint is an attraction in unvisited list, pop it
    const matchingIdx = unvisited.findIndex(p => p.name === startPoint.name);
    if (matchingIdx !== -1) {
      const startPlace = unvisited.splice(matchingIdx, 1)[0];
      orderedPlaces.push(startPlace);
    }
  } else {
    // If no start point specified, start with the first attraction in list
    const firstPlace = unvisited.shift();
    orderedPlaces.push(firstPlace);
    currentLat = parseFloat(firstPlace.latitude);
    currentLon = parseFloat(firstPlace.longitude);
    currentName = firstPlace.name;
  }

  let totalDistanceKm = 0;

  // Greedily find the nearest unvisited location
  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const place = unvisited[i];
      const dist = haversineDistance(
        currentLat,
        currentLon,
        parseFloat(place.latitude),
        parseFloat(place.longitude)
      );

      if (dist < minDistance) {
        minDistance = dist;
        nearestIndex = i;
      }
    }

    const nextPlace = unvisited.splice(nearestIndex, 1)[0];
    orderedPlaces.push(nextPlace);

    totalDistanceKm += minDistance;
    legs.push({
      from: currentName,
      to: nextPlace.name,
      distanceKm: minDistance
    });

    currentLat = parseFloat(nextPlace.latitude);
    currentLon = parseFloat(nextPlace.longitude);
    currentName = nextPlace.name;
  }

  // Calculate travel time based on transport mode
  const speed = TRANSPORT_SPEEDS[transportMode] || TRANSPORT_SPEEDS['Public Transport'];
  const estimatedHours = totalDistanceKm / speed;
  const estimatedTimeMinutes = Math.round(estimatedHours * 60);

  const hours = Math.floor(estimatedTimeMinutes / 60);
  const mins = estimatedTimeMinutes % 60;
  const formattedTime = hours > 0 ? `${hours} hr ${mins} min` : `${mins} min`;

  return {
    orderedPlaces,
    totalDistanceKm: Math.round(totalDistanceKm * 10) / 10,
    estimatedTimeMinutes,
    formattedTime,
    legs,
    transportMode
  };
}

module.exports = {
  haversineDistance,
  optimizeRoute,
  TRANSPORT_SPEEDS
};
