// LocalStorage abstraction
const PREFIX = 'ecolens_';

const get = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(`${PREFIX}${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error("Error reading localStorage", e);
    return defaultValue;
  }
};

const set = (key, value) => {
  try {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
  } catch (e) {
    console.error("Error writing to localStorage", e);
  }
};

export const storage = {
  // User Data
  getUser: () => get('user', null),
  setUser: (data) => set('user', data),
  
  // Logs
  getLogs: () => get('logs', []),
  addLog: (entry) => {
    const logs = storage.getLogs();
    const newLog = { ...entry, id: crypto.randomUUID(), timestamp: new Date().toISOString() };
    set('logs', [newLog, ...logs]);
    return newLog;
  },
  updateLog: (id, data) => {
    const logs = storage.getLogs();
    const index = logs.findIndex(l => l.id === id);
    if (index !== -1) {
      logs[index] = { ...logs[index], ...data };
      set('logs', logs);
    }
  },
  deleteLog: (id) => {
    const logs = storage.getLogs();
    set('logs', logs.filter(l => l.id !== id));
  },
  
  // Gamification
  getXP: () => get('xp', 0),
  addXP: (amount) => {
    const current = storage.getXP();
    set('xp', current + amount);
    return current + amount;
  },
  getLevel: () => get('level', 1),
  setLevel: (level) => set('level', level),
  
  getBadges: () => get('badges', []),
  unlockBadge: (badgeId) => {
    const badges = storage.getBadges();
    if (!badges.includes(badgeId)) {
      set('badges', [...badges, badgeId]);
      return true;
    }
    return false;
  },
  
  getStreak: () => get('streak', { current: 0, longest: 0, lastLogDate: null }),
  updateStreak: (newStreakObj) => set('streak', newStreakObj),
  
  // AI Cache
  getCachedAI: (key) => {
    const cache = get('ai_cache', {});
    const entry = cache[key];
    if (!entry) return null;
    
    // Check TTL (if elapsed time > ttlMinutes, return null)
    if (new Date().getTime() > entry.expiry) {
      return null;
    }
    return entry.data;
  },
  setCachedAI: (key, data, ttlMinutes = 60) => {
    const cache = get('ai_cache', {});
    cache[key] = {
      data,
      expiry: new Date().getTime() + (ttlMinutes * 60 * 1000)
    };
    set('ai_cache', cache);
  },

  clearAll: () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
};
