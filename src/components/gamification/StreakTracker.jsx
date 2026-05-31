import React, { useMemo } from 'react';
import GlassCard from '../shared/GlassCard';
import { useEmissions } from '../../hooks/useEmissions';
import { useXPSystem } from '../../hooks/useXPSystem';

export default function StreakTracker() {
  const { logs } = useEmissions();
  const { streak } = useXPSystem();

  // Heatmap generation
  const heatmap = useMemo(() => {
    const map = [];
    const today = new Date();
    
    // Create a lookup for daily totals
    const totals = {};
    logs.forEach(l => {
      const d = l.timestamp.split('T')[0];
      totals[d] = (totals[d] || 0) + l.emissions;
    });

    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      map.push({
        date: ds,
        val: totals[ds] !== undefined ? totals[ds] : null
      });
    }
    
    return map;
  }, [logs]);

  const getColor = (val) => {
    if (val === null) return 'bg-white/5';
    if (val < 3) return 'bg-accent-green/30';
    if (val < 6) return 'bg-accent-green/60';
    if (val < 10) return 'bg-accent-green';
    if (val < 15) return 'bg-accent-amber';
    return 'bg-accent-red';
  };

  const uniqueDays = new Set(logs.map(l => l.timestamp.split('T')[0])).size;

  return (
    <GlassCard title="Consistency & History" className="mb-8 overflow-hidden">
      <div className="flex justify-around mb-8 border-b border-white/10 pb-6">
        <div className="text-center">
          <div className="text-sm text-text-secondary mb-1">Current Streak</div>
          <div className="text-3xl font-heading font-bold text-white flex items-center justify-center gap-2">
            <span className={streak.current > 7 ? 'animate-pulse text-accent-amber' : ''}>🔥</span>
            {streak.current} <span className="text-lg text-text-secondary font-normal">days</span>
          </div>
        </div>
        <div className="w-px bg-white/10"></div>
        <div className="text-center">
          <div className="text-sm text-text-secondary mb-1">Longest Streak</div>
          <div className="text-3xl font-heading font-bold text-white flex items-center justify-center gap-2">
            🏆 {streak.longest}
          </div>
        </div>
        <div className="w-px bg-white/10"></div>
        <div className="text-center">
          <div className="text-sm text-text-secondary mb-1">Logged Days</div>
          <div className="text-3xl font-heading font-bold text-white flex items-center justify-center gap-2">
            📅 {uniqueDays}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="min-w-[800px]">
          <div className="flex flex-col gap-1 h-32 flex-wrap items-start">
            {heatmap.map((d, i) => (
              <div 
                key={i}
                className={`w-3 h-3 rounded-sm ${getColor(d.val)}`}
                title={`${d.date}: ${d.val !== null ? d.val.toFixed(1) + ' kg' : 'No data'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 items-center justify-end mt-4 text-xs text-text-secondary">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-white/5"></div>
          <div className="w-3 h-3 rounded-sm bg-accent-green/30"></div>
          <div className="w-3 h-3 rounded-sm bg-accent-green/60"></div>
          <div className="w-3 h-3 rounded-sm bg-accent-green"></div>
          <div className="w-3 h-3 rounded-sm bg-accent-amber"></div>
          <div className="w-3 h-3 rounded-sm bg-accent-red"></div>
        </div>
        <span>More</span>
      </div>
    </GlassCard>
  );
}
