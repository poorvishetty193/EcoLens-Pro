import { storage } from '../utils/storage';

const API_URL = 'https://api.electricitymap.org/v3/carbon-intensity/latest';

const COUNTRY_TO_ZONE = {
  IN: "IN-SO", US: "US-CAL", GB: "GB",
  DE: "DE", FR: "FR", AU: "AU-NSW",
  CA: "CA-ON", JP: "JP-TK", CN: "CN",
  BR: "BR-CS", ZA: "ZA", IT: "IT",
  ES: "ES", SE: "SE", NO: "NO-NO1",
  FI: "FI", DK: "DK-DK1", IE: "IE",
  NL: "NL", BE: "BE", CH: "CH",
  AT: "AT", PL: "PL", CZ: "CZ"
};

const WORLD_AVG_INTENSITY = 475; // gCO2eq/kWh

export const getGridIntensity = async (countryCode) => {
  const zone = COUNTRY_TO_ZONE[countryCode] || countryCode;
  const cacheKey = `grid_intensity_${zone}`;
  
  // 1. Check Cache (1 hour TTL)
  const cached = storage.getCachedAI(cacheKey);
  if (cached) {
    return cached;
  }

  // 2. Live API Call
  const apiKey = import.meta.env.VITE_ELECTRICITY_MAPS_API_KEY;
  if (apiKey && apiKey !== 'YOUR_ELECTRICITY_MAPS_API_KEY') {
    try {
      const response = await fetch(`${API_URL}?zone=${zone}`, {
        headers: { 'auth-token': apiKey }
      });

      if (response.ok) {
        const data = await response.json();
        const result = {
          intensity: data.carbonIntensity,
          fossilPct: data.fossilFuelPercentage || 60,
          zone: data.zone,
          isEstimate: false
        };
        // Cache for 60 minutes
        storage.setCachedAI(cacheKey, result, 60);
        return result;
      }
      console.warn(`Electricity Maps API failed: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.error("Error fetching live grid intensity:", error);
    }
  }

  // 3. Estimate Fallback
  console.log("Using estimated fallback grid intensity.");
  const fallback = {
    intensity: WORLD_AVG_INTENSITY,
    fossilPct: 60,
    zone: 'Global Average',
    isEstimate: true
  };
  
  // Cache the fallback for an hour so we don't spam the failing API
  storage.setCachedAI(cacheKey, fallback, 60);
  
  return fallback;
};
