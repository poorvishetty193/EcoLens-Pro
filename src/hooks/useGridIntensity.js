import { useState, useEffect } from 'react';
import { getGridIntensity } from '../services/gridService';

export const useGridIntensity = (countryCode) => {
  const [intensityData, setIntensityData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const fetchIntensity = async () => {
      if (!countryCode) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const result = await getGridIntensity(countryCode);
      
      if (mounted && result) {
        setIntensityData(result);
      }
      
      if (mounted) {
        setLoading(false);
      }
    };

    fetchIntensity();

    return () => {
      mounted = false;
    };
  }, [countryCode]);

  return { intensityData, loading };
};
