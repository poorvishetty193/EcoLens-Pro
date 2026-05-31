import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

export const EmissionsContext = createContext();

export const EmissionsProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setLogs(storage.getLogs());
    setIsReady(true);
  }, []);

  const addLog = (entry) => {
    const newLog = storage.addLog(entry);
    setLogs(storage.getLogs());
    return newLog;
  };

  const updateLog = (id, data) => {
    storage.updateLog(id, data);
    setLogs(storage.getLogs());
  };

  const deleteLog = (id) => {
    storage.deleteLog(id);
    setLogs(storage.getLogs());
  };

  // Derived calculations based on current logs state
  const getDailyTotal = (dateStr) => {
    return logs
      .filter(l => l.timestamp.startsWith(dateStr))
      .reduce((sum, l) => sum + l.emissions, 0);
  };

  const getWeeklyTotal = () => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    return logs
      .filter(l => new Date(l.timestamp) >= sevenDaysAgo)
      .reduce((sum, l) => sum + l.emissions, 0);
  };

  const getCategoryAverages = () => {
    const totals = { transport: 0, energy: 0, food: 0, shopping: 0, digital: 0 };
    const counts = { transport: 0, energy: 0, food: 0, shopping: 0, digital: 0 };
    
    logs.forEach(l => {
      if (totals[l.category] !== undefined) {
        totals[l.category] += l.emissions;
        counts[l.category] += 1;
      }
    });

    return {
      transport: counts.transport ? totals.transport / counts.transport : null,
      energy: counts.energy ? totals.energy / counts.energy : null,
      food: counts.food ? totals.food / counts.food : null,
      shopping: counts.shopping ? totals.shopping / counts.shopping : null,
      digital: counts.digital ? totals.digital / counts.digital : null,
    };
  };

  const value = {
    logs,
    addLog,
    updateLog,
    deleteLog,
    getDailyTotal,
    getWeeklyTotal,
    getCategoryAverages,
    isReady
  };

  return <EmissionsContext.Provider value={value}>{children}</EmissionsContext.Provider>;
};

export const useEmissions = () => useContext(EmissionsContext);
