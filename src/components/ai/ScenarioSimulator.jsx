import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../shared/GlassCard';
import ProgressRing from '../shared/ProgressRing';
import AnimatedCounter from '../shared/AnimatedCounter';
import LoadingSkeleton from '../shared/LoadingSkeleton';
import { useUser } from '../../context/UserContext';
import { getScenarioSimulation } from '../../services/aiService';
import { useToast } from '../../context/ToastContext';

const PRESET_SCENARIOS = [
  "🌱 Go fully vegan",
  "🚗 Buy an electric vehicle",
  "🏠 Work from home 5 days/week",
  "☀️ Install solar panels (5kW)",
  "✈️ Stop flying completely",
  "🚲 Cycle instead of drive",
  "🛍️ Buy nothing new for a year",
  "💡 Switch to 100% renewable energy",
];

export default function ScenarioSimulator() {
  const { user } = useUser();
  const [selectedScenario, setSelectedScenario] = useState(PRESET_SCENARIOS[0]);
  const [customScenario, setCustomScenario] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSimulate = async () => {
    setLoading(true);
    const scenarioToTest = isCustom ? customScenario : selectedScenario;
    const userAnnualKg = user?.baseline?.estimated_annual_kg || 4500;
    
    try {
      const simResult = await getScenarioSimulation(scenarioToTest, userAnnualKg);
      setResult(simResult);
    } catch (err) {
      addToast({ type: 'warning', title: 'Simulation Error', message: err.message || 'Failed to simulate scenario' });
    } finally {
      setLoading(false);
    }
  };

  const currentScore = user?.baseline?.planet_score || 50;

  return (
    <GlassCard title="Life Change Simulator">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Controls */}
        <div className="w-full md:w-1/3 space-y-4">
          <p className="text-sm text-text-secondary mb-4">See how major lifestyle changes would permanently alter your footprint.</p>
          
          {!isCustom ? (
            <select 
              value={selectedScenario} 
              onChange={e => setSelectedScenario(e.target.value)}
              className="w-full bg-black/30 border border-white/10 p-3 rounded-lg text-white"
            >
              {PRESET_SCENARIOS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          ) : (
            <input 
              type="text" 
              maxLength={100}
              placeholder="e.g. Move to a smaller apartment"
              value={customScenario}
              onChange={e => setCustomScenario(e.target.value)}
              className="w-full bg-black/30 border border-white/10 p-3 rounded-lg text-white"
            />
          )}

          <div className="flex justify-end">
            <button 
              onClick={() => setIsCustom(!isCustom)} 
              className="text-xs text-accent-teal hover:underline"
            >
              {isCustom ? "Use preset scenario" : "✏️ Custom scenario"}
            </button>
          </div>

          <button 
            onClick={handleSimulate}
            disabled={loading || (isCustom && !customScenario)}
            className="w-full bg-accent-purple text-white font-bold py-3 rounded-lg hover:bg-accent-purple/80 transition-colors disabled:opacity-50"
          >
            Simulate Impact
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 bg-black/20 rounded-2xl p-6 border border-white/5 relative overflow-hidden">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-bg-surface/50 backdrop-blur-sm z-10">
              <LoadingSkeleton variant="ring" className="absolute" />
            </div>
          ) : null}

          {!result && !loading ? (
            <div className="h-full flex items-center justify-center text-text-secondary italic text-center">
              Select a scenario and click Simulate to see the projected impact on your life.
            </div>
          ) : result ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col justify-between">
              
              <div className="flex justify-around items-center mb-6">
                <div className="text-center">
                  <ProgressRing value={currentScore} size={100} strokeWidth={6} color="var(--text-secondary)" label="CURRENT" />
                </div>
                <div className="text-2xl text-text-secondary">→</div>
                <div className="text-center">
                  <ProgressRing value={result.new_planet_score} size={120} strokeWidth={8} color="var(--accent-green)" label="NEW SCORE" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl text-center">
                  <div className="text-2xl font-heading font-bold text-accent-teal">
                    -<AnimatedCounter value={result.annual_reduction_kg} decimals={0} /> kg
                  </div>
                  <div className="text-xs text-text-secondary uppercase">Annual Reduction</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl text-center">
                  <div className="text-2xl font-heading font-bold text-accent-green">
                    -<AnimatedCounter value={result.monthly_reduction_kg} decimals={0} /> kg
                  </div>
                  <div className="text-xs text-text-secondary uppercase">Monthly Saving</div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                  <span className="text-sm text-text-secondary">Difficulty</span>
                  <span className="text-sm font-bold text-accent-amber">{result.difficulty}</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                  <span className="text-sm text-text-secondary">Time to impact</span>
                  <span className="text-sm text-white">{result.time_to_impact}</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xl font-heading font-bold text-white leading-tight">
                  "{result.equivalent}"
                </p>
                <p className="text-sm text-text-secondary mt-2">{result.cost_impact}</p>
                {result.flights_offset && <p className="text-xs text-accent-teal mt-1">✈️ {result.flights_offset}</p>}
              </div>

            </motion.div>
          ) : null}
        </div>
      </div>
    </GlassCard>
  );
}
