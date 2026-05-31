import React from 'react';
import { motion } from 'framer-motion';
import { useSimulation } from '../../context/SimulationContext';
import { ShieldCheck, ShieldAlert, Lock } from 'lucide-react';

const SPECIES = [
  { id: 'bee', name: 'Honey Bee Colony', unlockScore: 30, risk: 'Critical', habitat: 'Meadows', emoji: '🐝' },
  { id: 'turtle', name: 'Sea Turtle', unlockScore: 50, risk: 'Vulnerable', habitat: 'Oceans', emoji: '🐢' },
  { id: 'butterfly', name: 'Monarch Butterfly', unlockScore: 70, risk: 'Endangered', habitat: 'Forests', emoji: '🦋' },
  { id: 'eagle', name: 'Bald Eagle', unlockScore: 85, risk: 'Stable', habitat: 'Mountains', emoji: '🦅' }
];

export default function SaveTheSpecies() {
  const { healthScore } = useSimulation();

  return (
    <div className="w-full max-w-5xl mx-auto my-12 p-6">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-heading font-bold text-text-primary mb-4 glow-text">Save The Species</h2>
        <p className="text-text-secondary text-lg">As the planet heals, new species return. Your health score dictates their survival.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SPECIES.map((species, i) => {
          const isUnlocked = healthScore >= species.unlockScore;
          
          return (
            <motion.div 
              key={species.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative overflow-hidden rounded-3xl p-8 border ${isUnlocked ? 'bg-bg-surface border-accent-green' : 'bg-bg-primary border-white/10 opacity-70'} glass-panel`}
            >
              {!isUnlocked && (
                <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                  <Lock size={48} className="mb-4 text-text-secondary" />
                  <p className="font-bold">Unlocks at {species.unlockScore}% Health</p>
                  <p className="text-sm text-text-secondary mt-2">Currently at {healthScore.toFixed(0)}%</p>
                </div>
              )}
              
              <div className="flex justify-between items-start relative z-10">
                <div className="text-7xl mb-4 filter drop-shadow-lg">{species.emoji}</div>
                {isUnlocked && (
                  <div className="bg-accent-green/20 text-accent-green px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                    <ShieldCheck size={16} /> Saved
                  </div>
                )}
                {!isUnlocked && (
                  <div className="bg-accent-red/20 text-accent-red px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                    <ShieldAlert size={16} /> At Risk
                  </div>
                )}
              </div>
              
              <h3 className={`text-2xl font-bold font-heading mb-2 ${isUnlocked ? 'text-white' : 'text-text-secondary'}`}>
                {species.name}
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Habitat</span>
                  <span className={isUnlocked ? 'text-text-primary' : 'text-text-secondary'}>{species.habitat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Risk Level</span>
                  <span className={isUnlocked ? 'text-text-primary' : 'text-text-secondary'}>{species.risk}</span>
                </div>
              </div>
              
              {isUnlocked && (
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="w-full bg-bg-primary h-2 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-accent-green h-full"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <div className="text-right text-xs text-text-secondary mt-1">Population Thriving</div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
