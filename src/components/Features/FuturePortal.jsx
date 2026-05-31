import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getFutureProjections } from '../../services/ai';
import { useSimulation } from '../../context/SimulationContext';
import { Loader2, ArrowRight } from 'lucide-react';

export default function FuturePortal() {
  const [scenario, setScenario] = useState('');
  const [loading, setLoading] = useState(false);
  const [projections, setProjections] = useState(null);
  const { updateHealth, addAction } = useSimulation();

  const handleSimulate = async () => {
    if (!scenario) return;
    setLoading(true);
    try {
      const results = await getFutureProjections(scenario);
      setProjections(results);
      if (results && results.length > 0) {
        const finalImpact = results[results.length - 1].climateScoreIncrease;
        updateHealth(finalImpact);
        addAction(`Simulated Future Scenario: ${scenario}`, finalImpact);
      }
    } catch (error) {
      console.error("Simulation error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 lg:p-12 glass-panel rounded-3xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-green to-accent-teal"></div>
      
      <div className="text-center mb-10">
        <h2 className="text-4xl font-heading font-bold text-text-primary mb-4 glow-text">Future Earth Portal</h2>
        <p className="text-text-secondary text-lg">Enter a sustainability scenario to simulate its long-term impact on the planet.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <input 
          type="text" 
          className="flex-1 bg-white/90 border border-border-subtle rounded-xl px-6 py-4 text-black placeholder-gray-600 focus:outline-none focus:border-accent-green transition-colors"
          placeholder="e.g. 50% electric vehicles by 2030..."
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
        />
        <button 
          onClick={handleSimulate}
          disabled={loading || !scenario}
          className="bg-accent-green hover:bg-accent-teal text-bg-primary font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Open Portal"}
          {!loading && <ArrowRight />}
        </button>
      </div>

      {projections && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projections.map((proj, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.3, duration: 0.8 }}
              key={proj.year}
              className="bg-bg-surface border border-border-subtle rounded-2xl p-6 relative overflow-hidden group hover:border-accent-green transition-all"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-accent-green/10 rounded-bl-full -z-10 group-hover:scale-150 transition-transform"></div>
              <h4 className="text-xl font-heading font-bold text-accent-green mb-4">Year {proj.year}</h4>
              <div className="space-y-3 text-sm text-text-secondary">
                <div className="flex justify-between">
                  <span>Carbon Drop</span>
                  <span className="text-text-primary font-semibold">{proj.carbonReduction}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Water Saved</span>
                  <span className="text-text-primary font-semibold">{proj.waterSaved}M L</span>
                </div>
                <div className="flex justify-between">
                  <span>Air Quality</span>
                  <span className="text-text-primary font-semibold">+{proj.airQuality}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
