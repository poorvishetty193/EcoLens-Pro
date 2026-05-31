import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getClimateStrategy } from '../../services/ai';
import { Loader2, Target, Clock, DollarSign, Leaf, AlertCircle } from 'lucide-react';

export default function ClimateStrategist() {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState(null);

  const handleStrategize = async () => {
    if (!goal) return;
    setLoading(true);
    try {
      const results = await getClimateStrategy(goal);
      setStrategy(results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-12 p-6 glass-panel rounded-3xl">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-heading font-bold text-text-primary mb-4 glow-text">Climate Strategist AI</h2>
        <p className="text-text-secondary text-lg">Enter a sustainability goal to generate a comprehensive action plan.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <input 
          type="text" 
          className="flex-1 bg-bg-surface/50 border border-border-subtle rounded-xl px-6 py-4 text-text-primary focus:outline-none focus:border-accent-amber transition-colors"
          placeholder="e.g. Reduce my college campus emissions by 30%"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
        <button 
          onClick={handleStrategize}
          disabled={loading || !goal}
          className="bg-accent-amber hover:bg-yellow-500 text-bg-primary font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Generate Strategy"}
        </button>
      </div>

      {strategy && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-heading font-bold text-accent-amber mb-4 flex items-center gap-2">
              <Target /> Action Plan
            </h3>
            <ul className="space-y-4">
              {strategy.actionPlan.map((action, idx) => (
                <li key={idx} className="bg-bg-surface p-4 rounded-xl border border-border-subtle flex gap-4 items-start">
                  <div className="bg-accent-amber/20 text-accent-amber w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    {idx + 1}
                  </div>
                  <span className="text-text-primary">{action}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div className="bg-bg-surface p-6 rounded-2xl border border-border-subtle">
              <h4 className="text-text-secondary uppercase text-sm tracking-wider mb-4">Strategy Details</h4>
              <ul className="space-y-6">
                <li className="flex items-center gap-4">
                  <Clock className="text-accent-teal w-6 h-6" />
                  <div>
                    <p className="text-xs text-text-secondary">Timeline</p>
                    <p className="text-white font-semibold">{strategy.timeline}</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <DollarSign className="text-accent-green w-6 h-6" />
                  <div>
                    <p className="text-xs text-text-secondary">Estimated Cost</p>
                    <p className="text-white font-semibold">{strategy.estimatedCost}</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <Leaf className="text-accent-green w-6 h-6" />
                  <div>
                    <p className="text-xs text-text-secondary">Carbon Reduction</p>
                    <p className="text-white font-semibold">{strategy.expectedCarbonReduction}</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <AlertCircle className="text-accent-red w-6 h-6" />
                  <div>
                    <p className="text-xs text-text-secondary">Difficulty</p>
                    <p className="text-white font-semibold">{strategy.difficultyLevel}</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-accent-amber/20 to-transparent p-6 rounded-2xl border border-accent-amber text-center">
              <p className="text-sm text-text-secondary mb-2">Priority Ranking</p>
              <p className="text-5xl font-bold text-accent-amber">{strategy.priorityRanking}/10</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
