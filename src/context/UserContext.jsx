import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { calculateLevel } from '../utils/xpCalculator';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [xp, setXpState] = useState(0);
  const [level, setLevelState] = useState(1);
  const [badges, setBadgesState] = useState([]);
  const [streak, setStreakState] = useState({ current: 0, longest: 0, lastLogDate: null });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Load from local storage on mount
    setUserState(storage.getUser());
    setXpState(storage.getXP());
    setLevelState(storage.getLevel());
    setBadgesState(storage.getBadges());
    setStreakState(storage.getStreak());
    setIsReady(true);
  }, []);

  const setUser = (userData) => {
    storage.setUser(userData);
    setUserState(userData);
  };

  const addXP = (amount) => {
    const newXp = storage.addXP(amount);
    setXpState(newXp);
    
    // Check level up
    const newLevel = calculateLevel(newXp);
    if (newLevel > level) {
      storage.setLevel(newLevel);
      setLevelState(newLevel);
    }
  };

  const unlockBadge = (badgeId) => {
    if (storage.unlockBadge(badgeId)) {
      setBadgesState(storage.getBadges());
      return true;
    }
    return false;
  };

  const updateStreak = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    let newStreak = { ...streak };
    
    if (streak.lastLogDate === todayStr) {
      // Already logged today
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (streak.lastLogDate === yesterdayStr) {
      // Logged yesterday, increment streak
      newStreak.current += 1;
    } else {
      // Streak broken
      newStreak.current = 1;
    }

    if (newStreak.current > newStreak.longest) {
      newStreak.longest = newStreak.current;
    }
    newStreak.lastLogDate = todayStr;
    
    storage.updateStreak(newStreak);
    setStreakState(newStreak);
  };

  const value = {
    user, setUser,
    xp, addXP,
    level,
    badges, unlockBadge,
    streak, updateStreak,
    isReady
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
