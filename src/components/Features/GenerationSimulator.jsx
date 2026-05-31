import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGenerationSimulation } from '../../services/ai';
import { Loader2, Baby, PersonStanding, GraduationCap, Briefcase, Heart } from 'lucide-react';

const AGE_ICONS = {
  10: <Baby size={24} />,
  20: <GraduationCap size={24} />,
  40: <Briefcase size={24} />,
  70: <Heart size={24} />
};

export default function GenerationSimulator() {
  const [policy, setPolicy] = useState('');
  const [loading, setLoading] = useState(false);
  const [simulation, setSimulation] = useState(null);

  const handleSimulate = async () => {
    if (!policy) return;
    setLoading(true);
    try {
      const results = await getGenerationSimulation(policy);
      setSimulation(results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-12 p-6 glass-panel rounded-3xl">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-heading font-bold text-text-primary mb-4 glow-text">Future Generation Simulator</h2>
        <p className="text-text-secondary text-lg">See how your policy affects a child born today across their entire lifetime.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-16 max-w-2xl mx-auto">
        <input 
          type="text" 
          className="flex-1 bg-bg-surface/50 border border-border-subtle rounded-xl px-6 py-4 text-text-primary focus:outline-none focus:border-accent-amber transition-colors"
          placeholder="e.g. Ban new fossil fuel vehicles by 2030"
          value={policy}
          onChange={(e) => setPolicy(e.target.value)}
        />
        <button 
          onClick={handleSimulate}
          disabled={loading || !policy}
          className="bg-accent-amber hover:bg-yellow-500 text-bg-primary font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><PersonStanding /> Simulate Life</>}
        </button>
      </div>

      {simulation && (
        <div className="relative border-l-2 border-accent-amber/30 ml-4 md:ml-12 space-y-12 pb-8">
          <AnimatePresence>
            {simulation.map((milestone, index) => (
              <motion.div 
                key={milestone.age}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.4, duration: 0.8 }}
                className="relative pl-12"
              >
                <div className="absolute -left-[25px] top-0 w-12 h-12 bg-bg-primary border-2 border-accent-amber rounded-full flex items-center justify-center text-accent-amber shadow-[0_0_15px_rgba(255,171,64,0.3)]">
                  {AGE_ICONS[milestone.age] || <PersonStanding size={24} />}
                </div>
                
                <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 hover:border-accent-amber transition-colors group">
                  <h3 className="text-2xl font-bold font-heading text-accent-amber mb-2">Age {milestone.age}</h3>
                  <p className="text-lg text-text-primary group-hover:text-white transition-colors leading-relaxed">
                    "{milestone.impact}"
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
