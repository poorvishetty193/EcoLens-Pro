import { useEmissions as useEmissionsContext } from '../context/EmissionsContext';

// Simple wrapper hook to match the requested architecture
export const useEmissions = () => {
  return useEmissionsContext();
};
