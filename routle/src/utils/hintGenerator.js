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

// Main hint generator - updated with more hint types
export const generateHint = (knownCountry, targetCountry, hintNumber) => {
  const distance = getDistanceInKm(
    knownCountry.latitude,
    knownCountry.longitude,
    targetCountry.latitude,
    targetCountry.longitude
  );

  const direction = getDirection(
    knownCountry.latitude,
    knownCountry.longitude,
    targetCountry.latitude,
    targetCountry.longitude
  );

  const temperatureDiff = getTemperatureDiff(
    knownCountry.averageTemperature,
    targetCountry.averageTemperature
  );

  const timezoneDiff = getTimeZoneDiff(
    knownCountry.timezone,
    targetCountry.timezone
  );

  // Check if continent property exists before using it
  const sameContinent =
    knownCountry.continent && targetCountry.continent
      ? knownCountry.continent === targetCountry.continent
      : "Unknown";

  // Check if population property exists before using it
  const hasPopulationData = knownCountry.population && targetCountry.population;
  const populationComparison = hasPopulationData
    ? targetCountry.population > knownCountry.population
      ? "larger"
      : "smaller"
    : "unknown";

  const populationRatio = hasPopulationData
    ? Math.round(
        Math.max(targetCountry.population, knownCountry.population) /
          Math.min(targetCountry.population, knownCountry.population)
      )
    : 0;

  // Check if hasCoastline property exists before using it
  const hasCoastlineData =
    "hasCoastline" in knownCountry && "hasCoastline" in targetCountry;
  const coastline = hasCoastlineData
    ? targetCountry.hasCoastline && knownCountry.hasCoastline
      ? "Both countries have coastlines"
      : targetCountry.hasCoastline
      ? `Unlike ${knownCountry.name}, the target country has a coastline`
      : `Like ${knownCountry.name}, the target country has no coastline`
    : "Information about coastlines is not available";

  // Check if area property exists before using it
  const hasAreaData = knownCountry.area && targetCountry.area;
  const landArea = hasAreaData
    ? targetCountry.area > knownCountry.area * 1.5
      ? `The target country is much larger than ${knownCountry.name}`
      : targetCountry.area < knownCountry.area * 0.5
      ? `The target country is much smaller than ${knownCountry.name}`
      : `The target country is similar in size to ${knownCountry.name}`
    : "Information about land area is not available";

  // Check if languages property exists before using it
  const hasLanguageData = knownCountry.languages && targetCountry.languages;
  const officialLanguage = hasLanguageData
    ? targetCountry.languages.some((lang) =>
        knownCountry.languages.includes(lang)
      )
      ? `The target country shares at least one official language with ${knownCountry.name}`
      : `The target country doesn't share any official languages with ${knownCountry.name}`
    : "Information about languages is not available";

  const hemisphereHint =
    knownCountry.latitude * targetCountry.latitude >= 0
      ? `The target country is in the same hemisphere as ${knownCountry.name}`
      : `The target country is in the opposite hemisphere from ${knownCountry.name}`;

  // Reorder hints from less obvious to more obvious
  switch (hintNumber) {
    case 1:
      // Start with hemisphere - very general and not too revealing
      return {
        type: "hemisphere",
        icon: "🌐",
        value: hemisphereHint,
      };
    case 2:
      // Then give temperature - gives some climate info but not specific location
      return {
        type: "temperature",
        icon: "🌡️",
        value: `The target country is ${Math.abs(temperatureDiff)}°C ${
          temperatureDiff > 0 ? "warmer" : "colder"
        } than ${knownCountry.name}`,
      };
    case 3:
      // Timezone gives a rough idea of east-west position
      return {
        type: "timezone",
        icon: "🕒",
        value: `The target country is ${Math.abs(timezoneDiff)} hour${
          Math.abs(timezoneDiff) !== 1 ? "s" : ""
        } ${timezoneDiff > 0 ? "ahead of" : "behind"} ${knownCountry.name}`,
      };
    case 4:
      // Continent/region narrows it down further
      if (sameContinent === "Unknown") {
        return {
          type: "region",
          icon: "🌍",
          value: `The target country is in ${
            targetCountry.region || "a different region"
          }`,
        };
      }
      return {
        type: "continent",
        icon: "🗺️",
        value: sameContinent
          ? `The target country is on the same continent as ${knownCountry.name}`
          : `The target country is on a different continent than ${knownCountry.name}`,
      };
    case 5:
      // Now give direction - getting more specific
      return {
        type: "direction",
        icon: "🧭",
        value: `Look towards the ${direction} from ${knownCountry.name}`,
      };
    case 6:
      // Area gives size comparison
      if (!hasAreaData) {
        return {
          type: "currency",
          icon: "💰",
          value: targetCountry.currency
            ? `The currency of the target country is ${targetCountry.currency}`
            : `The target country uses a different currency than ${knownCountry.name}`,
        };
      }
      return {
        type: "area",
        icon: "📐",
        value: landArea,
      };
    case 7:
      // Population comparison
      if (!hasPopulationData) {
        return {
          type: "capital",
          icon: "��️",
          value: targetCountry.capital
            ? `The capital city of the target country starts with the letter "${targetCountry.capital.charAt(
                0
              )}"`
            : `The target country has a different capital than ${knownCountry.name}`,
        };
      }
      return {
        type: "population",
        icon: "👥",
        value: `The target country has a ${populationComparison} population than ${
          knownCountry.name
        }${
          populationRatio > 0
            ? ` (about ${populationRatio}x ${
                populationComparison === "larger" ? "more" : "fewer"
              } people)`
            : ""
        }`,
      };
    case 8:
      // Geography/coastline info
      if (!hasCoastlineData) {
        return {
          type: "flag",
          icon: "🚩",
          value: `The flag of the target country contains ${
            targetCountry.flagColors
              ? "colors like " + targetCountry.flagColors
              : "multiple colors"
          }`,
        };
      }
      return {
        type: "geography",
        icon: "🌊",
        value: coastline,
      };
    case 9:
      // Language - quite specific
      if (!hasLanguageData) {
        return {
          type: "name",
          icon: "🔤",
          value: `The target country's name starts with the letter "${targetCountry.name.charAt(
            0
          )}"`,
        };
      }
      return {
        type: "language",
        icon: "🗣️",
        value: officialLanguage,
      };
    case 10:
    default:
      // Finally, distance as the most helpful hint
      return {
        type: "distance",
        icon: "📏",
        value: `The target country is about ${distance} km away from ${knownCountry.name}`,
      };
  }
};

export { getDistanceInKm, getDirection, getTimeZoneDiff, getTemperatureDiff };
