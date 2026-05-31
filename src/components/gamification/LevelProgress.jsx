import React from 'react';
import GlassCard from '../shared/GlassCard';
import { useXPSystem } from '../../hooks/useXPSystem';
import { getLevelName } from '../../utils/formatters';

export default function LevelProgress() {
  const { xp, level, progressPct, xpToNext } = useXPSystem();

  const getTierDetails = (lvl) => {
    if (lvl <= 5) return { color: 'var(--accent-green)', icon: '🌱' };
    if (lvl <= 10) return { color: 'var(--accent-teal)', icon: '🌿' };
    if (lvl <= 20) return { color: '#00b0ff', icon: '🌳' }; // blue-green
    if (lvl <= 30) return { color: 'var(--accent-purple)', icon: '🦋' };
    if (lvl <= 40) return { color: 'var(--accent-amber)', icon: '⚡' };
    return { color: '#ffd740', icon: '🌍' }; // gold
  };

  const tier = getTierDetails(level);

  return (
    <GlassCard className="mb-8 p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
        {/* Badge */}
        <div 
          className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center text-5xl md:text-6xl shadow-[0_0_40px_rgba(255,255,255,0.1)] relative border-4"
          style={{ borderColor: tier.color, backgroundColor: `${tier.color}15`, boxShadow: `0 0 30px ${tier.color}40` }}
        >
          {tier.icon}
          <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-bg-surface border-2 border-white/20 flex items-center justify-center font-bold text-white text-sm">
            {level}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 w-full text-center md:text-left">
          <div className="text-text-secondary uppercase tracking-widest text-xs font-bold mb-1" style={{ color: tier.color }}>Level {level}</div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">{getLevelName(level)}</h2>
          
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-white">
                  {progressPct.toFixed(1)}% to Next Level
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-text-secondary">
                  {xpToNext} XP needed
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-white/10 relative">
              <div style={{ width: `${progressPct}%`, backgroundColor: tier.color }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ease-out"></div>
              {/* Markers */}
              <div className="absolute top-0 bottom-0 left-[25%] w-[1px] bg-white/20"></div>
              <div className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-white/20"></div>
              <div className="absolute top-0 bottom-0 left-[75%] w-[1px] bg-white/20"></div>
            </div>
          </div>
          
          <div className="text-sm text-text-secondary">
            Total XP Earned: <span className="font-bold text-white">{xp}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
