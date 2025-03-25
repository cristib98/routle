import { countries, getCountryByName } from "./countriesData";

// List of daily country pairs (known and target countries)
const dailyRoutes = [
  { knownCountry: "France", targetCountry: "Morocco" },
  { knownCountry: "United States", targetCountry: "Japan" },
  { knownCountry: "Brazil", targetCountry: "South Africa" },
  { knownCountry: "Australia", targetCountry: "India" },
  { knownCountry: "Germany", targetCountry: "Thailand" },
  { knownCountry: "Canada", targetCountry: "Argentina" },
  { knownCountry: "Russia", targetCountry: "Mexico" },
  { knownCountry: "United Kingdom", targetCountry: "Egypt" },
  { knownCountry: "Italy", targetCountry: "China" },
  { knownCountry: "Spain", targetCountry: "Turkey" },
  { knownCountry: "South Korea", targetCountry: "Brazil" },
  { knownCountry: "Norway", targetCountry: "New Zealand" },
  { knownCountry: "Sweden", targetCountry: "Greece" },
  { knownCountry: "Netherlands", targetCountry: "Indonesia" },
  { knownCountry: "Belgium", targetCountry: "Kenya" },
  { knownCountry: "Switzerland", targetCountry: "Vietnam" },
  { knownCountry: "Austria", targetCountry: "Colombia" },
  { knownCountry: "Poland", targetCountry: "Israel" },
  { knownCountry: "Denmark", targetCountry: "Chile" },
  { knownCountry: "Finland", targetCountry: "Portugal" },
  { knownCountry: "Singapore", targetCountry: "Peru" },
  { knownCountry: "Ireland", targetCountry: "Malaysia" },
  { knownCountry: "New Zealand", targetCountry: "Ireland" },
  { knownCountry: "Greece", targetCountry: "South Korea" },
  { knownCountry: "Portugal", targetCountry: "Saudi Arabia" },
  { knownCountry: "Czech Republic", targetCountry: "United Arab Emirates" },
  { knownCountry: "Hungary", targetCountry: "Philippines" },
  { knownCountry: "Israel", targetCountry: "Nigeria" },
  { knownCountry: "Thailand", targetCountry: "Hungary" },
  { knownCountry: "Malaysia", targetCountry: "Denmark" },
];

// Function to get a country pair based on the current date
export const getDailyPair = () => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  const routeIndex = (dayOfYear % dailyRoutes.length) + 1;

  const todaysPair = dailyRoutes[routeIndex];

  // Convert country names to actual country objects from countriesData
  const knownCountry = getCountryByName(todaysPair.knownCountry);
  const targetCountry = getCountryByName(todaysPair.targetCountry);

  // Make sure we have both countries
  if (!knownCountry || !targetCountry) {
    console.error("Could not find countries for today's pair:", todaysPair);
    // Fallback to a default pair
    return {
      knownCountry: countries[0],
      targetCountry: countries[1],
    };
  }

  return { knownCountry, targetCountry };
};
