import { useState, useEffect } from 'react';
import { getWeatherAndAQI } from '../services/weatherService';

export const useWeatherData = (city, country) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchWeather = async () => {
      if (!city) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const result = await getWeatherAndAQI(city, country);
        if (mounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchWeather();

    return () => {
      mounted = false;
    };
  }, [city, country]);

  return { data, loading, error };
};
