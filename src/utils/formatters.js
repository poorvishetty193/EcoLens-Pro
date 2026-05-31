import { format, formatDistanceToNow } from 'date-fns';

export const formatCO2 = (kg) => {
  if (kg === undefined || kg === null) return '0 kg';
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)} t`;
  }
  // Remove trailing zeros
  return `${Number(kg.toFixed(2))} kg`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  return format(new Date(dateString), 'MMM d, yyyy');
};

export const formatRelativeDate = (dateString) => {
  if (!dateString) return '';
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};

export const getWeatherEmoji = (code) => {
  // Open-Meteo WMO codes mapping
  if (code === 0) return '☀️';
  if (code === 1 || code === 2) return '⛅';
  if (code === 3) return '☁️';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌧️';
  if (code >= 85 && code <= 86) return '❄️';
  if (code >= 95) return '⛈️';
  return '🌡️';
};

export const getCategoryColor = (category) => {
  const map = {
    transport: 'var(--accent-teal)',
    energy: 'var(--accent-amber)',
    food: 'var(--accent-green)',
    shopping: 'var(--accent-purple)',
    digital: 'var(--accent-red)',
  };
  return map[category] || 'var(--text-secondary)';
};

export const getScoreColor = (score) => {
  if (score >= 70) return 'var(--accent-green)';
  if (score >= 40) return 'var(--accent-amber)';
  return 'var(--accent-red)';
};

export const LEVEL_NAMES = [
  "Carbon Seedling", "Eco Novice", "Green Beginner", "Planet Learner", "Earth Scout",
  "Sprout", "Green Thumb", "Eco Enthusiast", "Nature Defender", "Earth Advocate",
  "Sapling", "Sustainability Seeker", "Climate Conscious", "Carbon Cutter", "Green Ranger",
  "Tree Hugger", "Eco Warrior", "Planet Protector", "Zero Carbon Hero", "Earth Champion",
  "Forest Guardian", "Climate Crusader", "Renewable Ranger", "Eco Legend", "Climate Guardian",
  // Expandable to 50
];

export const getLevelName = (level) => {
  return LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)] || "Climate Guardian";
};
