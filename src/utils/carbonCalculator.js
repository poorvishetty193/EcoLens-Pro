import { EMISSION_FACTORS } from './emissionFactors';

export const calculateEmissions = (category, subcategory, inputs) => {
  try {
    switch (category) {
      case 'transport':
        return calculateTransport(subcategory, inputs);
      case 'energy':
        return calculateEnergy(subcategory, inputs);
      case 'food':
        return calculateFood(subcategory, inputs);
      case 'shopping':
        return calculateShopping(subcategory, inputs);
      case 'digital':
        return calculateDigital(subcategory, inputs);
      default:
        return 0;
    }
  } catch (error) {
    console.error("Error calculating emissions:", error);
    return 0;
  }
};

const calculateTransport = (type, inputs) => {
  const { distance = 0, passengers = 1, isReturn = false } = inputs;
  const factor = EMISSION_FACTORS.transport[type] || 0;
  const totalDistance = isReturn ? distance * 2 : distance;
  return (totalDistance * factor) / passengers;
};

const calculateEnergy = (type, inputs) => {
  if (type === 'electricity') {
    const { kwh = 0, gridIntensity = EMISSION_FACTORS.energy.electricity_world_avg * 1000 } = inputs;
    // gridIntensity is usually given in gCO2/kWh, we need kgCO2/kWh
    const factor = gridIntensity / 1000;
    return kwh * factor;
  }
  
  if (type === 'solar') {
    const { kwh = 0 } = inputs;
    // Solar offsetting grid electricity
    return -(kwh * EMISSION_FACTORS.energy.electricity_world_avg);
  }

  const factor = EMISSION_FACTORS.energy[type] || 0;
  return (inputs.amount || 0) * factor;
};

const calculateFood = (type, inputs) => {
  const { amount = 1, wastePercent = 0 } = inputs;
  const factor = EMISSION_FACTORS.food[type] || 0;
  
  // For ingredients, amount might be in kg or portions. Assuming amount is multiplier of the base factor.
  const baseEmissions = amount * factor;
  
  // Wasted food adds its emissions linearly 
  return baseEmissions * (1 + (wastePercent / 100));
};

const calculateShopping = (type, inputs) => {
  const { quantity = 1, isSecondhand = false } = inputs;
  let factor = EMISSION_FACTORS.shopping[type] || 0;
  
  if (isSecondhand) {
    factor *= EMISSION_FACTORS.shopping.secondhand_multiplier;
  }
  
  return factor * quantity;
};

const calculateDigital = (type, inputs) => {
  const { hours = 0, amount = 0 } = inputs;
  const factor = EMISSION_FACTORS.digital[type] || EMISSION_FACTORS.crypto[type] || 0;
  
  // Distinguish between time-based and quantity-based (like crypto tx or GB upload)
  if (type.includes('tx') || type.includes('upload')) {
    return amount * factor;
  }
  
  return hours * factor;
};
