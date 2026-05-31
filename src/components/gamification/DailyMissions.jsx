import React, { useState, useEffect } from 'react';
import GlassCard from '../shared/GlassCard';
import { useEmissions } from '../../hooks/useEmissions';
import { useXPSystem } from '../../hooks/useXPSystem';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';

const MISSION_POOL = [
  { id: 1, text: "Log a meal under 1.5kg CO₂", xp: 75, check: (logs) => logs.some(l => l.category==='food' && l.emissions < 1.5) },
  { id: 2, text: "Keep transport under 2kg today", xp: 100, check: (logs) => { const sum = logs.filter(l=>l.category==='transport').reduce((s,l)=>s+l.emissions,0); return logs.length>0 && sum < 2; } },
  { id: 3, text: "Log all 3 meal categories", xp: 50, check: (logs) => false }, // simplified, assuming we just check count
  { id: 4, text: "Log a 0kg activity (walk/cycle)", xp: 80, check: (logs) => logs.some(l => l.emissions === 0) },
  { id: 5, text: "No meat logged today", xp: 90, check: (logs) => logs.some(l => l.category === 'food' && l.subcategory !== 'beef' && l.subcategory !== 'pork' && l.subcategory !== 'lamb') },
  { id: 6, text: "Log solar generation", xp: 60, check: (logs) => logs.some(l => l.subcategory === 'solar') },
  { id: 7, text: "Keep total daily CO₂ under 5kg", xp: 150, check: (logs) => logs.length > 0 && logs.reduce((s,l)=>s+l.emissions,0) < 5 },
  { id: 8, text: "Use AI Coach tool today", xp: 70, check: () => false }, // Can hook to localStorage flag
  { id: 9, text: "Log 5+ activities today", xp: 100, check: (logs) => logs.length >= 5 },
  { id: 10, text: "Total food emissions under 3kg", xp: 80, check: (logs) => logs.length > 0 && logs.filter(l=>l.category==='food').reduce((s,l)=>s+l.emissions,0) < 3 },
  { id: 11, text: "No flights logged this week", xp: 200, check: () => false }, 
  { id: 12, text: "Energy usage under 2kg today", xp: 90, check: (logs) => logs.length > 0 && logs.filter(l=>l.category==='energy').reduce((s,l)=>s+l.emissions,0) < 2 },
  { id: 13, text: "Log a secondhand purchase", xp: 60, check: (logs) => logs.some(l => l.inputs?.isSecondhand) },
  { id: 14, text: "Log within 1 hour of waking", xp: 40, check: () => false },
  { id: 15, text: "Run the Forecast Engine", xp: 50, check: () => false },
  { id: 16, text: "Try the Scenario Simulator", xp: 50, check: () => false },
  { id: 17, text: "Keep digital emissions under 0.5kg", xp: 70, check: (logs) => logs.length > 0 && logs.filter(l=>l.category==='digital').reduce((s,l)=>s+l.emissions,0) < 0.5 },
  { id: 18, text: "Achieve net-zero for any category today", xp: 130, check: (logs) => logs.some(l => l.emissions <= 0) },
  { id: 19, text: "Beat your weekly transport average", xp: 120, check: () => false },
  { id: 20, text: "Beat yesterday's total", xp: 110, check: () => false }
];

export default function DailyMissions() {
  const { logs } = useEmissions();
  const { addXP } = useXPSystem();
  const { addToast } = useToast();
  
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    // Seed by date
    const dateStr = new Date().toISOString().split('T')[0];
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
    const idx1 = Math.abs(hash) % 20;
    const idx2 = Math.abs(hash * 3) % 20;
    const idx3 = Math.abs(hash * 7) % 20;
    
    // We store completed status in localStorage to persist across reloads
    const saved = JSON.parse(localStorage.getItem(`missions_${dateStr}`)) || {};

    const mList = [
      { ...MISSION_POOL[idx1], completed: !!saved[MISSION_POOL[idx1].id] },
      { ...MISSION_POOL[idx2], completed: !!saved[MISSION_POOL[idx2].id] },
      { ...MISSION_POOL[idx3], completed: !!saved[MISSION_POOL[idx3].id] }
    ];
    setMissions(mList);
  }, []);

  // Check missions
  useEffect(() => {
    const dateStr = new Date().toISOString().split('T')[0];
    const todayLogs = logs.filter(l => l.timestamp.startsWith(dateStr));
    
    let updated = false;
    const newMissions = missions.map(m => {
      if (!m.completed && m.check(todayLogs)) {
        updated = true;
        
        // Reward
        addXP(m.xp);
        addToast({ type: 'xp', title: 'Mission Complete!', message: `+${m.xp} XP` });
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
        
        return { ...m, completed: true };
      }
      return m;
    });

    if (updated) {
      setMissions(newMissions);
      const toSave = {};
      newMissions.forEach(m => { if (m.completed) toSave[m.id] = true; });
      localStorage.setItem(`missions_${dateStr}`, JSON.stringify(toSave));
    }
  }, [logs, missions]);

  return (
    <GlassCard title="Daily Missions" className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {missions.map(m => (
          <div key={m.id} className={`p-4 rounded-xl border transition-all ${m.completed ? 'bg-accent-green/10 border-accent-green/50' : 'bg-black/20 border-white/10'}`}>
            <div className="flex justify-between items-start mb-3">
              <div className={`text-sm font-medium ${m.completed ? 'text-white line-through opacity-70' : 'text-white'}`}>
                {m.text}
              </div>
              <span className="bg-accent-purple/20 text-accent-purple text-xs font-bold px-2 py-1 rounded">
                {m.xp} XP
              </span>
            </div>
            
            {m.completed ? (
              <div className="text-accent-green font-bold text-sm flex items-center gap-1">
                ✓ Completed
              </div>
            ) : (
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-accent-teal h-full w-0 transition-all duration-500"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
