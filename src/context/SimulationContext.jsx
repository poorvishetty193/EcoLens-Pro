import React, { createContext, useContext, useState } from 'react';

const SimulationContext = createContext();

export const useSimulation = () => useContext(SimulationContext);

export const SimulationProvider = ({ children }) => {
  // Default values only (NO localStorage)
  const [healthScore, setHealthScore] = useState(50);
  const [planetDna, setPlanetDna] = useState('Observer');
  const [completedQuests, setCompletedQuests] = useState([]);
  const [actionHistory, setActionHistory] = useState([]);

  const updateHealth = (amount) => {
    setHealthScore((prev) =>
      Math.min(100, Math.max(0, prev + amount))
    );
  };

  const addAction = (description, impact) => {
    const newAction = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      description,
      impact
    };

    setActionHistory((prev) => [newAction, ...prev]);
  };

  const completeQuest = (questId, impactScore) => {
    if (!completedQuests.includes(questId)) {
      setCompletedQuests((prev) => [...prev, questId]);

      updateHealth(impactScore);

      addAction(
        `Completed Eco Quest: ${questId}`,
        impactScore
      );
    }
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