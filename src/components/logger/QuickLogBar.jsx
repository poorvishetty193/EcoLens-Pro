import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmissions } from '../../hooks/useEmissions';
import { useXPSystem } from '../../hooks/useXPSystem';
import { useToast } from '../../context/ToastContext';
import { calculateEmissions } from '../../utils/carbonCalculator';
import { calculateEntryXP } from '../../utils/xpCalculator';

const QUICK_ACTIONS = [
  { id: 'drive', icon: '🚗', label: 'Drive', category: 'transport', sub: 'car_petrol_medium', unit: 'km', defaultVal: 10 },
  { id: 'flight', icon: '✈️', label: 'Flight', category: 'transport', sub: 'flight_short_economy', unit: 'passengers', defaultVal: 1 },
  { id: 'electric', icon: '⚡', label: 'Electric', category: 'energy', sub: 'electricity', unit: 'kWh', defaultVal: 5 },
  { id: 'gas', icon: '🔥', label: 'Gas', category: 'energy', sub: 'natural_gas', unit: 'm³', defaultVal: 2 },
  { id: 'meat', icon: '🥩', label: 'Meat', category: 'food', sub: 'beef', unit: 'portions', defaultVal: 1 },
  { id: 'vegan', icon: '🥗', label: 'Vegan', category: 'food', sub: 'vegan', unit: 'portions', defaultVal: 1 },
  { id: 'shop', icon: '🛍️', label: 'Shopping', category: 'shopping', sub: 'tshirt', unit: 'items', defaultVal: 1 },
  { id: 'digital', icon: '💻', label: 'Digital', category: 'digital', sub: 'streaming_1080p_hr', unit: 'hours', defaultVal: 2 },
  { id: 'solar', icon: '☀️', label: 'Solar', category: 'energy', sub: 'solar', unit: 'kWh', defaultVal: 5 },
  { id: 'walk', icon: '🚶', label: 'Walk', category: 'transport', sub: 'walk', unit: 'km', defaultVal: 3 },
];

export default function QuickLogBar() {
  const [activeId, setActiveId] = useState(null);
  const [val, setVal] = useState('');
  const { addLog } = useEmissions();
  const { addXP, streak } = useXPSystem();
  const { addToast } = useToast();

  const handleLog = (action) => {
    const amount = Number(val) || action.defaultVal;
    
    let inputs = {};
    if (action.category === 'transport' && action.sub !== 'walk') inputs = { distance: amount };
    else if (action.category === 'energy' && action.unit === 'kWh') inputs = { kwh: amount };
    else if (action.category === 'energy') inputs = { amount };
    else if (action.category === 'food') inputs = { amount };
    else if (action.category === 'shopping') inputs = { quantity: amount };
    else if (action.category === 'digital') inputs = { hours: amount };

    const emissions = action.sub === 'walk' || action.sub === 'vegan' ? 0 : calculateEmissions(action.category, action.sub, inputs);

    const entry = {
      category: action.category,
      subcategory: action.sub,
      emissions,
      inputs
    };

    addLog(entry);
    const xpEarned = calculateEntryXP(entry, streak.current, null);
    addXP(xpEarned);

    addToast({
      type: 'xp',
      title: 'Quick Log Saved',
      message: `+${xpEarned} XP earned! 🌱`
    });

    setActiveId(null);
    setVal('');
  };

  return (
    <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-4 sticky top-4 z-30 backdrop-blur-xl shadow-2xl">
      <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
        {QUICK_ACTIONS.map(action => (
          <button
            key={action.id}
            onClick={() => { setActiveId(activeId === action.id ? null : action.id); setVal(''); }}
            className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all ${activeId === action.id ? 'bg-accent-green/20 border border-accent-green' : 'bg-white/5 hover:bg-white/10'}`}
          >
            <span className="text-2xl mb-1">{action.icon}</span>
            <span className="text-[10px] text-text-secondary font-medium">{action.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {activeId && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-4 pt-4 border-t border-white/5 flex gap-4 items-center"
          >
            {(() => {
              const action = QUICK_ACTIONS.find(a => a.id === activeId);
              return (
                <>
                  <div className="flex-1 flex items-center bg-black/30 rounded-lg px-3 py-2 border border-white/10">
                    <input
                      type="number"
                      autoFocus
                      placeholder={action.defaultVal}
                      value={val}
                      onChange={e => setVal(e.target.value)}
                      className="bg-transparent text-white w-full focus:outline-none"
                    />
                    <span className="text-text-secondary text-sm ml-2">{action.unit}</span>
                  </div>
                  <button
                    onClick={() => handleLog(action)}
                    className="bg-accent-green text-bg-primary font-bold px-6 py-2 rounded-lg hover:bg-white transition-colors"
                  >
                    Log It
                  </button>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
