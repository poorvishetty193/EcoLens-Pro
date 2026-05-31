import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import ButterflyScene from './ButterflyScene';
import { getButterflyNarrative } from '../../services/ai';
import { useSimulation } from '../../context/SimulationContext';
import { Zap, Rewind, Play } from 'lucide-react';

const ACTIONS = [
  { id: 'solar', label: 'Install Rooftop Solar', icon: '☀️' },
  { id: 'meat', label: 'Eat Vegetarian 2x/Week', icon: '🌱' },
  { id: 'cycle', label: 'Cycle 3 Trips/Week', icon: '🚲' },
  { id: 'secondhand', label: 'Buy Second-Hand', icon: '🛍️' }
];

// Helper to animate numbers
const Counter = ({ from, to, suffix = "" }) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let start = from;
    const end = to;
    if (start === end) return;
    let totalMiliseconds = 1000;
    let incrementTime = (totalMiliseconds / Math.abs(end - start));

    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [from, to]);

  return <span>{count}{suffix}</span>;
};

export default function ButterflyEffect() {
  const [selectedAction, setSelectedAction] = useState(null);
  const [timelineYear, setTimelineYear] = useState(2026);
  const [isSimulating, setIsSimulating] = useState(false);
  const [story, setStory] = useState("");
  const { addAction, actionLog } = useSimulation();

  const handleSelectAction = async (action) => {
    setSelectedAction(action);
    setTimelineYear(2026);
    setIsSimulating(true);
    setStory("");

    try {
      const result = await getButterflyNarrative(action.label);
      if (result && result.narrative) {
        setStory(result.narrative);
      }
    } catch (error) {
      console.error("Narrative failed:", error);
      setStory("A single choice echoed through time, gradually healing the planet.");
    }
  };

  const handleTimelineChange = (year) => {
    setTimelineYear(year);
    if (year === 2050) {
      setIsSimulating(false);
      addAction(`Butterfly Simulation Complete: ${selectedAction?.label}`, 15);
    }
  };

  const calculateMetrics = () => {
    if (!selectedAction) return { co2: 0, trees: 0, water: 0, aq: 0 };
    const multiplier = (timelineYear - 2026) / 24; // 0 to 1
    
    let base = { co2: 12, trees: 45, water: 320, aq: 18 };
    if (selectedAction.id === 'solar') base = { co2: 250, trees: 80, water: 100, aq: 5 };
    if (selectedAction.id === 'meat') base = { co2: 50, trees: 20, water: 5000, aq: 2 };

    return {
      co2: Math.floor(base.co2 * Math.max(1, multiplier * 10)),
      trees: Math.floor(base.trees * Math.max(1, multiplier * 5)),
      water: Math.floor(base.water * Math.max(1, multiplier * 8)),
      aq: Math.floor(base.aq * Math.max(1, multiplier * 3))
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="w-full min-h-[800px] h-[85vh] relative rounded-3xl overflow-hidden glass-panel border border-border-subtle shadow-2xl bg-[#030712] flex flex-col">
      {/* 3D Engine Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 8, 15], fov: 50 }}>
          <ButterflyScene 
            timelineYear={timelineYear} 
            selectedAction={selectedAction} 
            isSimulating={isSimulating}
            actionLog={actionLog}
          />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-8">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl lg:text-5xl font-heading font-bold text-white mb-2 tracking-wide glow-text drop-shadow-2xl">
            Butterfly Effect Engine
          </h2>
          <p className="text-accent-teal text-xl font-medium tracking-widest uppercase bg-black/40 inline-block px-4 py-1 rounded-full backdrop-blur-sm border border-white/10">
            Every action changes the future.
          </p>
        </div>

        {/* Narrative & Metrics */}
        <AnimatePresence>
          {selectedAction && (
            <div className="flex flex-col md:flex-row justify-between w-full mt-8 gap-4">
              
              {/* Floating Holographic Metrics */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="pointer-events-auto flex flex-col gap-4"
              >
                {[
                  { label: "CO₂ Prevented", value: metrics.co2, suffix: " kg" },
                  { label: "Trees Equivalent", value: metrics.trees, suffix: "" },
                  { label: "Water Saved", value: metrics.water, suffix: " L" },
                  { label: "Air Quality", value: metrics.aq, suffix: "% Imp." }
                ].map((m, i) => (
                  <motion.div 
                    key={m.label}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-black/40 backdrop-blur-md border border-accent-teal/50 rounded-xl px-6 py-3 flex items-center justify-between gap-8 min-w-[250px]"
                  >
                    <span className="text-text-secondary font-medium">{m.label}</span>
                    <span className="text-accent-teal font-bold text-xl">
                      +<Counter from={0} to={m.value} suffix={m.suffix} />
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Typewriter AI Story */}
              {story && (
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="max-w-md bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl h-fit max-h-[300px] overflow-y-auto custom-scrollbar pointer-events-auto"
                >
                  <h3 className="text-accent-purple font-bold mb-2 flex items-center gap-2">
                    <Zap size={16} /> Timeline Altered
                  </h3>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="text-white text-lg leading-relaxed"
                  >
                    {story}
                  </motion.p>
                </motion.div>
              )}

            </div>
          )}
        </AnimatePresence>

        {/* Action Selection or Timeline Slider */}
        <div className="pointer-events-auto w-full max-w-4xl mx-auto bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl mt-auto">
          {!selectedAction ? (
            <div>
              <p className="text-center text-text-secondary mb-4 font-medium uppercase tracking-widest text-sm">Select an initiator action</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {ACTIONS.map(action => (
                  <button 
                    key={action.id}
                    onClick={() => handleSelectAction(action)}
                    className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-accent-purple/20 hover:border-accent-purple transition-all group"
                  >
                    <span className="text-3xl group-hover:scale-125 transition-transform">{action.icon}</span>
                    <span className="text-white font-medium text-center">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <span className="text-2xl">{selectedAction.icon}</span>
                  {selectedAction.label}
                </h3>
                <button 
                  onClick={() => setSelectedAction(null)}
                  className="text-text-secondary hover:text-white transition-colors flex items-center gap-2 text-sm uppercase tracking-widest"
                >
                  <Rewind size={16} /> Reset Timeline
                </button>
              </div>

              {/* Timeline Slider */}
              <div className="relative pt-4 pb-2">
                <input 
                  type="range" 
                  min="2026" 
                  max="2050" 
                  step="1"
                  value={timelineYear}
                  onChange={(e) => handleTimelineChange(parseInt(e.target.value))}
                  className="w-full appearance-none bg-white/10 h-2 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-accent-teal [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
                />
                <div className="flex justify-between text-text-secondary mt-4 font-mono font-bold">
                  <span className={timelineYear === 2026 ? "text-accent-teal" : ""}>2026</span>
                  <span className={timelineYear === 2030 ? "text-accent-teal" : ""}>2030</span>
                  <span className={timelineYear === 2040 ? "text-accent-teal" : ""}>2040</span>
                  <span className={timelineYear === 2050 ? "text-accent-teal scale-125 transition-transform" : ""}>2050</span>
                </div>
              </div>

              {timelineYear === 2050 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-6 p-4 bg-accent-green/20 border border-accent-green rounded-xl"
                >
                  <p className="text-accent-green font-bold text-lg">"One small action created a measurable future."</p>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
