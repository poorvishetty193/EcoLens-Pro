import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const RIPPLE_ACTIONS = {
  cycle: [
    "Replace 1 car trip with cycling",
    "CO₂ Emissions Reduced by 2kg",
    "Cleaner Air in Neighborhood",
    "Respiratory Health Improves",
    "Lower Local Healthcare Costs",
    "Higher Quality of Urban Life"
  ],
  meat: [
    "Plant-based meal once a week",
    "Water consumption reduced by 1000L",
    "Less agricultural land needed",
    "Ecosystem recovery begins",
    "Biodiversity increases locally",
    "Resilient local environments"
  ],
  solar: [
    "Install solar on community center",
    "Fossil fuel demand drops",
    "Local grid stability improves",
    "Energy costs reduced",
    "Funds diverted to education",
    "Smarter, greener community"
  ]
};

export default function RippleEffectEngine() {
  const [activeAction, setActiveAction] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);

  const startRipple = (actionKey) => {
    setActiveAction(actionKey);
    setStepIndex(0);
    
    // Simulate the chain reaction progressively
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < 6) {
        setStepIndex(i);
      } else {
        clearInterval(interval);
      }
    }, 1000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 p-6 glass-panel rounded-3xl text-center">
      <h2 className="text-4xl font-heading font-bold text-text-primary mb-4 glow-text">Ripple Effect Engine</h2>
      <p className="text-text-secondary text-lg mb-8">Choose one small action and visualize its massive chain reaction.</p>
      
      {!activeAction && (
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <button onClick={() => startRipple('cycle')} className="px-6 py-4 bg-bg-surface border border-accent-teal hover:bg-accent-teal hover:text-bg-primary rounded-xl transition-all">
            Cycle Instead of Drive
          </button>
          <button onClick={() => startRipple('meat')} className="px-6 py-4 bg-bg-surface border border-accent-green hover:bg-accent-green hover:text-bg-primary rounded-xl transition-all">
            Plant-Based Meal
          </button>
          <button onClick={() => startRipple('solar')} className="px-6 py-4 bg-bg-surface border border-accent-amber hover:bg-accent-amber hover:text-bg-primary rounded-xl transition-all">
            Community Solar
          </button>
        </div>
      )}

      {activeAction && (
        <div className="mt-8 flex flex-col items-center">
          <AnimatePresence>
            {RIPPLE_ACTIONS[activeAction].slice(0, stepIndex + 1).map((text, idx) => (
              <React.Fragment key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`px-8 py-4 rounded-xl font-bold text-lg ${
                    idx === 0 ? 'bg-accent-teal text-bg-primary' : 
                    idx === 5 ? 'bg-gradient-to-r from-accent-green to-accent-teal text-bg-primary text-xl shadow-[0_0_20px_rgba(0,230,118,0.5)]' :
                    'bg-bg-surface border border-border-subtle text-text-primary'
                  }`}
                >
                  {text}
                </motion.div>
                {idx < Math.min(stepIndex, 4) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="py-2 text-accent-green"
                  >
                    <ArrowDown />
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </AnimatePresence>
          
          {stepIndex >= 5 && (
            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={() => setActiveAction(null)}
              className="mt-8 text-sm text-text-secondary hover:text-white underline underline-offset-4"
            >
              Reset Ripple Effect
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
}
