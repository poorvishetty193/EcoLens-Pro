import React from 'react';
import GlassCard from '../shared/GlassCard';
import ProgressRing from '../shared/ProgressRing';
import { useEmissions } from '../../hooks/useEmissions';
import { useUser } from '../../context/UserContext';
import AnimatedCounter from '../shared/AnimatedCounter';

export default function PlanetHealthScore() {
  const { logs, getDailyTotal } = useEmissions();
  const { user } = useUser();

  // Score formula: max(0, 100 - ((userDailyAvgKg / 13.7) * 100))
  // Earths formula: userAnnualKg / 1600 * number_of_earths (simplified as avg/day * 365 / 1600)
  
  const totalKg = logs.reduce((sum, l) => sum + l.emissions, 0);
  const uniqueDays = new Set(logs.map(l => l.timestamp.split('T')[0])).size || 1;
  const userDailyAvgKg = totalKg / uniqueDays;
  
  // Use baseline if no logs yet
  const effectiveDailyAvg = logs.length > 0 ? userDailyAvgKg : (user?.baseline?.estimated_annual_kg / 365 || 12);
  
  let score = Math.round(Math.max(0, 100 - ((effectiveDailyAvg / 13.7) * 100)));
  const earths = ((effectiveDailyAvg * 365) / 1600).toFixed(1);

  return (
    <GlassCard className="flex flex-col md:flex-row items-center justify-between">
      <div className="flex-1 mb-6 md:mb-0">
        <h2 className="text-2xl font-heading font-bold text-white mb-2">Planet Health Score</h2>
        <p className="text-text-secondary max-w-sm mb-6">Your score represents your planetary impact based on recent activity. Higher is better.</p>
        
        <div className="bg-[rgba(255,255,255,0.05)] p-4 rounded-xl inline-block">
          <div className="text-sm text-text-secondary">If everyone lived like you, we'd need:</div>
          <div className="text-3xl font-heading font-bold text-accent-amber mt-1">
            <AnimatedCounter value={Number(earths)} decimals={1} /> Earths 🌍
          </div>
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center scale-75 opacity-30">
          <ProgressRing value={47} size={240} strokeWidth={4} color="var(--text-secondary)" animated={false} />
        </div>
        <ProgressRing value={score} size={240} strokeWidth={12} color={score >= 70 ? 'var(--accent-green)' : score >= 40 ? 'var(--accent-amber)' : 'var(--accent-red)'} label="SCORE" />
      </div>
    </GlassCard>
  );
}
