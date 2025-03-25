// Calculate distance between two points in km using Haversine formula
export const calculateDistance = (coord1, coord2) => {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;

  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km

  return Math.round(distance);
};

// Get temperature comparison
export const getTemperatureDiff = (temp1, temp2) => {
  const diff = Math.abs(temp1 - temp2);

  if (diff <= 3) {
    return "Very similar climates";
  } else if (diff <= 7) {
    return "Somewhat different climates";
  } else if (diff <= 15) {
    return "Significantly different climates";
  } else {
    return "Completely different climates";
  }
};

// Get timezone difference
export const getTimeZoneDiff = (timezone1, timezone2) => {
  const diff = Math.abs(timezone1 - timezone2);

  if (diff === 0) {
    return "Same time zone";
  } else if (diff < 1) {
    return `${diff * 60} minutes apart`;
  } else if (diff === 1) {
    return "1 hour apart";
  } else {
    return `${diff} hours apart`;
  }
};

// Calculate approximate flight time based on distance
export const calculateFlightTime = (coord1, coord2) => {
  const distance = calculateDistance(coord1, coord2);

  // Very rough approximation of flight time:
  // - Average speed of ~800 km/h for longer flights
  // - Add 1 hour for takeoff, landing, and non-direct routing
  let hours = distance / 800 + 1;

  // Short flights have more overhead relative to distance
  if (distance < 1000) {
    hours = distance / 500 + 1; // Slower effective speed for short flights
  }

  return Math.round(hours * 10) / 10; // Round to nearest 0.1
};

// Format distance for display
export const formatDistance = (distance) => {
  if (distance === 0) {
    return "In the same location";
  } else if (distance < 100) {
    return "Very close to each other";
  } else {
    return `${distance} km apart`;
  }
};
