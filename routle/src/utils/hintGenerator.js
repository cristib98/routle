// Helper functions for distance calculation
const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return Math.round(distance);
};

const getDirection = (lat1, lon1, lat2, lon2) => {
  const dLon = lon2 - lon1;
  const y = Math.sin(dLon * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180));
  const x =
    Math.cos(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) -
    Math.sin(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.cos(dLon * (Math.PI / 180));
  const brng = Math.atan2(y, x) * (180 / Math.PI);
  const direction = (brng + 360) % 360;

  // Convert bearing to cardinal direction
  const cardinals = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];
  return cardinals[Math.round(direction / 45)];
};

const getTimeZoneDiff = (timezone1, timezone2) => {
  // Extract hours from timezone strings like "UTC+1" or "UTC-5"
  const extractHours = (tz) => {
    const match = tz.match(/UTC([+-]\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const hours1 = extractHours(timezone1);
  const hours2 = extractHours(timezone2);

  return hours2 - hours1;
};

const getTemperatureDiff = (temp1, temp2) => {
  return Math.round(temp2 - temp1);
};

// Main hint generator
export const generateHint = (guessedCountry, targetCountry, hintNumber) => {
  const distance = getDistanceInKm(
    guessedCountry.latitude,
    guessedCountry.longitude,
    targetCountry.latitude,
    targetCountry.longitude
  );

  const direction = getDirection(
    guessedCountry.latitude,
    guessedCountry.longitude,
    targetCountry.latitude,
    targetCountry.longitude
  );

  const temperatureDiff = getTemperatureDiff(
    guessedCountry.averageTemperature,
    targetCountry.averageTemperature
  );

  const timezoneDiff = getTimeZoneDiff(
    guessedCountry.timezone,
    targetCountry.timezone
  );

  const hemisphereHint =
    guessedCountry.latitude * targetCountry.latitude >= 0
      ? `The target country is in the same hemisphere as ${guessedCountry.name}`
      : `The target country is in the opposite hemisphere from ${guessedCountry.name}`;

  // Select hint based on hint number
  switch (hintNumber) {
    case 1:
      return {
        type: "distance",
        icon: "📏",
        value: `The target country is about ${distance} km away from ${guessedCountry.name}`,
      };
    case 2:
      return {
        type: "direction",
        icon: "🧭",
        value: `Look towards the ${direction} from ${guessedCountry.name}`,
      };
    case 3:
      return {
        type: "temperature",
        icon: "🌡️",
        value: `The target country is ${Math.abs(temperatureDiff)}°C ${
          temperatureDiff > 0 ? "warmer" : "colder"
        } than ${guessedCountry.name}`,
      };
    case 4:
      return {
        type: "timezone",
        icon: "🕒",
        value: `The target country is ${Math.abs(timezoneDiff)} hour${
          Math.abs(timezoneDiff) !== 1 ? "s" : ""
        } ${timezoneDiff > 0 ? "ahead of" : "behind"} ${guessedCountry.name}`,
      };
    case 5:
    default:
      return {
        type: "hemisphere",
        icon: "🌐",
        value: hemisphereHint,
      };
  }
};

export { getDistanceInKm, getDirection, getTimeZoneDiff, getTemperatureDiff };
