import React, { createContext, useContext, useState, useEffect } from 'react';

const SimulationContext = createContext();

export const useSimulation = () => useContext(SimulationContext);

export const SimulationProvider = ({ children }) => {
  const [healthScore, setHealthScore] = useState(() => {
    const saved = localStorage.getItem('planetHealthScore');
    return saved ? parseInt(saved, 10) : 50;
  });

  const [planetDna, setPlanetDna] = useState(() => {
    const saved = localStorage.getItem('planetDna');
    return saved || 'Observer'; // Will be updated by AI later
  });

  const [completedQuests, setCompletedQuests] = useState(() => {
    const saved = localStorage.getItem('completedQuests');
    return saved ? JSON.parse(saved) : [];
  });

  const [actionHistory, setActionHistory] = useState(() => {
    const saved = localStorage.getItem('actionHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('planetHealthScore', healthScore.toString());
  }, [healthScore]);

  useEffect(() => {
    localStorage.setItem('planetDna', planetDna);
  }, [planetDna]);

  useEffect(() => {
    localStorage.setItem('completedQuests', JSON.stringify(completedQuests));
  }, [completedQuests]);

  useEffect(() => {
    localStorage.setItem('actionHistory', JSON.stringify(actionHistory));
  }, [actionHistory]);

  const updateHealth = (amount) => {
    setHealthScore((prev) => Math.min(100, Math.max(0, prev + amount)));
  };

  const completeQuest = (questId, impactScore) => {
    if (!completedQuests.includes(questId)) {
      setCompletedQuests([...completedQuests, questId]);
      updateHealth(impactScore);
      addAction(`Completed Eco Quest: ${questId}`, impactScore);
    }
  };

  const addAction = (description, impact) => {
    const newAction = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      description,
      impact
    };
    setActionHistory(prev => [newAction, ...prev]);
  };

  return (
    <SimulationContext.Provider
      value={{
        healthScore,
        updateHealth,
        planetDna,
        setPlanetDna,
        completedQuests,
        completeQuest,
        actionHistory,
        addAction,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};
