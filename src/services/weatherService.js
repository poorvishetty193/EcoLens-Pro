import { storage } from '../utils/storage';

export const getWeatherAndAQI = async (city, country) => {
  if (!city) return null;

  const cacheKey = `weather_${city.toLowerCase()}`;
  const cached = storage.getCachedAI(cacheKey);
  if (cached) return cached;

  try {
    // 1. Geocode the city
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    const geoData = await geoRes.json();
    
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("City not found");
    }
    
    const { latitude, longitude } = geoData.results[0];

    // 2. Fetch Weather & AQI
    const [weatherRes, aqiRes] = await Promise.all([
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m`),
      fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm10,pm2_5`)
    ]);

    const weatherData = await weatherRes.json();
    const aqiData = await aqiRes.json();

    const currentW = weatherData.current;
    const currentA = aqiData.current;

    const result = {
      temp: currentW.temperature_2m,
      feelsLike: currentW.apparent_temperature,
      humidity: currentW.relative_humidity_2m,
      wind: currentW.wind_speed_10m,
      weatherCode: currentW.weather_code,
      aqi: currentA.us_aqi,
      pm25: currentA.pm2_5,
      pm10: currentA.pm10,
    };

    storage.setCachedAI(cacheKey, result, 30); // 30 min cache
    return result;

  } catch (error) {
    console.error("Weather fetch error:", error);
    return null;
  }
};
