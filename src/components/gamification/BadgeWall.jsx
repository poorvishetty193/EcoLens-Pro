import React from 'react';
import GlassCard from '../shared/GlassCard';
import { useXPSystem } from '../../hooks/useXPSystem';

const BADGES = [
  { id: 'b1', icon: '🌱', name: 'First Step', desc: 'Log your first activity', type: 'Logging' },
  { id: 'b2', icon: '📅', name: 'Dedicated Logger', desc: '7 day streak', type: 'Logging' },
  { id: 'b3', icon: '🔥', name: 'On Fire', desc: '30 day streak', type: 'Logging' },
  { id: 'b4', icon: '💯', name: 'Century', desc: '100 total log entries', type: 'Logging' },
  { id: 'b5', icon: '⚡', name: 'Speed Logger', desc: 'Log within 1hr of midnight 3 days', type: 'Logging' },
  { id: 'b6', icon: '🎯', name: 'Carbon Cutter', desc: 'Reduce weekly avg by 20%', type: 'Emissions' },
  { id: 'b7', icon: '🌍', name: 'Net Zero Hero', desc: 'Achieve net zero for 1 full day', type: 'Emissions' },
  { id: 'b8', icon: '📉', name: 'Downward Spiral', desc: '5 consecutive days decreasing', type: 'Emissions' },
  { id: 'b9', icon: '🏆', name: 'Half and Half', desc: 'Reduce footprint by 50%', type: 'Emissions' },
  { id: 'b10', icon: '⭐', name: 'Below Average', desc: 'Under global avg 7 days straight', type: 'Emissions' },
  { id: 'b11', icon: '🥗', name: 'Salad Days', desc: 'Log vegan meal 5 times', type: 'Food' },
  { id: 'b12', icon: '🌿', name: 'Vegan Tuesday', desc: 'Log a fully vegan day', type: 'Food' },
  { id: 'b13', icon: '🐟', name: 'Sea Change', desc: 'Choose fish over meat 10 times', type: 'Food' },
  { id: 'b14', icon: '🍳', name: 'Waste Not', desc: 'Zero food waste 7 days', type: 'Food' },
  { id: 'b15', icon: '🌾', name: 'Plant Pioneer', desc: 'Food under 1kg for 5 days', type: 'Food' },
  { id: 'b16', icon: '🚶', name: 'Walkabout', desc: 'Walk/cycle 10 times', type: 'Transport' },
  { id: 'b17', icon: '🚌', name: 'Transit Hero', desc: 'Public transport 15 times', type: 'Transport' },
  { id: 'b18', icon: '✈️', name: 'Ground Bound', desc: 'No flights for 30 days', type: 'Transport' },
  { id: 'b19', icon: '🛞', name: 'Low Roller', desc: 'Transport under 1kg/day for 7 days', type: 'Transport' },
  { id: 'b20', icon: '🚗', name: 'Electric Dreams', desc: 'Log EV travel 10 times', type: 'Transport' },
  { id: 'b21', icon: '☀️', name: 'Solar Hero', desc: 'Log solar generation 5 times', type: 'Energy' },
  { id: 'b22', icon: '💡', name: 'Energy Miser', desc: 'Energy under 1kg/day for 5 days', type: 'Energy' },
  { id: 'b23', icon: '🌙', name: 'Night Saver', desc: 'Under 3kg total 10 days', type: 'Energy' },
  { id: 'b24', icon: '♻️', name: 'Second Life', desc: '5 secondhand purchases', type: 'Shopping' },
  { id: 'b25', icon: '🛑', name: 'Buy Nothing', desc: 'No shopping for 14 days', type: 'Shopping' },
  { id: 'b26', icon: '🤖', name: 'AI Explorer', desc: 'Use all 3 AI tools', type: 'AI' },
  { id: 'b27', icon: '🔮', name: 'Future Gazer', desc: 'Run Forecast Engine 5 times', type: 'AI' },
  { id: 'b28', icon: '🧪', name: 'Lab Rat', desc: 'Try all 8 scenarios', type: 'AI' },
  { id: 'b29', icon: '🎖️', name: 'Planet Protector', desc: 'Reach Planet Score 75', type: 'Milestone' },
  { id: 'b30', icon: '👑', name: 'Climate Guardian', desc: 'Reach Level 25', type: 'Milestone' },
];

export default function BadgeWall() {
  const { badges } = useXPSystem();

  return (
    <GlassCard className="mb-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-xl font-heading font-bold text-white">Achievements</h3>
        </div>
        <div className="text-accent-amber font-bold">
          {badges.length} / 30 unlocked
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {BADGES.map(b => {
          const unlocked = badges.includes(b.id);
          return (
            <div 
              key={b.id} 
              className={`group perspective-1000 w-full aspect-square ${!unlocked ? 'opacity-40 grayscale' : ''}`}
            >
              <div className="relative w-full h-full preserve-3d transition-all duration-500 group-hover:rotate-y-180 cursor-pointer">
                
                {/* Front */}
                <div className={`absolute inset-0 backface-hidden flex flex-col items-center justify-center rounded-xl border ${unlocked ? 'border-[#ffd740]/50 bg-[#ffd740]/10 shadow-[0_0_15px_rgba(255,215,64,0.2)]' : 'border-white/10 bg-black/30'}`}>
                  <span className="text-4xl mb-1">{b.icon}</span>
                  {!unlocked && <span className="absolute top-2 right-2 text-xs">🔒</span>}
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-2 rounded-xl bg-[#0a1a10] border border-[#ffd740]/30 text-center">
                  <span className="text-[10px] text-[#ffd740] uppercase tracking-wider mb-1 block leading-tight font-bold">{b.name}</span>
                  <span className="text-[9px] text-white leading-tight">{b.desc}</span>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
