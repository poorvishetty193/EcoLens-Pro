export const calculateEntryXP = (entry, streak = 0, categoryAverage = null) => {
  let xp = 10; // Base XP
  
  // Detail bonus (e.g., entered passengers, fuel type, etc.)
  const baseFields = ['id', 'timestamp', 'category', 'subcategory', 'emissions'];
  const extraFields = Object.keys(entry).filter(k => !baseFields.includes(k));
  xp += extraFields.length * 5;

  // Green / Exceptional bonus
  if (categoryAverage && entry.emissions < categoryAverage) {
    xp += 20; // Green bonus
    if (entry.emissions < categoryAverage * 0.5) {
      xp += 20; // Additional 20 for exceptional (total 40)
    }
  }

  // Zero emission bonus (walk/cycle)
  if (entry.emissions === 0) {
    xp += 50;
  }

  // Streak multiplier
  const multiplier = 1 + (streak / 100);
  
  return Math.round(xp * multiplier);
};

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 900, 1400, 2100, 3000, 4100, 5500, 
  7200, 9300, 11900, 15100, 19000, 23700, 29300, 35900, 
  43600, 52500, 62700, 74300, 87400, 102100, 118500
];

export const calculateLevel = (totalXP) => {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  return level;
};

export const getXPProgress = (totalXP) => {
  const currentLevel = calculateLevel(totalXP);
  
  // Max level handling
  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    return { currentLevel, xpToNext: 0, progressPct: 100 };
  }

  const currentLevelBaseXP = LEVEL_THRESHOLDS[currentLevel - 1];
  const nextLevelXP = LEVEL_THRESHOLDS[currentLevel];
  const xpIntoLevel = totalXP - currentLevelBaseXP;
  const xpRequiredForLevel = nextLevelXP - currentLevelBaseXP;
  const progressPct = Math.min(100, Math.max(0, (xpIntoLevel / xpRequiredForLevel) * 100));

  return {
    currentLevel,
    xpToNext: nextLevelXP - totalXP,
    progressPct
  };
};
