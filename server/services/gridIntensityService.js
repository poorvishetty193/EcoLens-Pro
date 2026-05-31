const cacheService = require('./cacheService');

const COUNTRY_TO_ZONE = {
    "IN": "IN-KA", // Just as an example for India (Karnataka) since IN is too broad sometimes, or use IN
    "US": "US-CAL-BANC",
    "GB": "GB",
    "DE": "DE",
    "FR": "FR",
    // Add more as needed
};

const getGridIntensity = async (countryCode) => {
    const cacheKey = `grid_${countryCode}`;
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    const apiKey = process.env.ELECTRICITY_MAPS_API_KEY;
    if (!apiKey || apiKey === 'YOUR_ELECTRICITY_MAPS_API_KEY') {
        // Fallback mock data
        return { carbonIntensity: 475, fossilFuelPercentage: 60 };
    }

    const zone = COUNTRY_TO_ZONE[countryCode] || countryCode;

    try {
        const response = await fetch(`https://api.electricitymap.org/v3/carbon-intensity/latest?zone=${zone}`, {
            headers: { 'auth-token': apiKey }
        });

        if (!response.ok) {
            throw new Error('Electricity Maps API error');
        }

        const data = await response.json();
        const result = {
            carbonIntensity: data.carbonIntensity,
            fossilFuelPercentage: data.fossilFuelPercentage || 50
        };

        await cacheService.set(cacheKey, result, 3600); // Cache for 1 hour
        return result;
    } catch (error) {
        console.error('Grid Intensity Error:', error);
        return { carbonIntensity: 475, fossilFuelPercentage: 60 }; // World average fallback
    }
};

module.exports = {
    getGridIntensity
};
