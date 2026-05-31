import { useUser } from '../context/UserContext';
import { getXPProgress } from '../utils/xpCalculator';

export const useXPSystem = () => {
  const { xp, addXP, level, badges, unlockBadge, streak, updateStreak } = useUser();
  
  const progress = getXPProgress(xp);

  return {
    xp,
    level,
    badges,
    streak,
    addXP,
    unlockBadge,
    updateStreak,
    progressPct: progress.progressPct,
    xpToNext: progress.xpToNext
  };
};
