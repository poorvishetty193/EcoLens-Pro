import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import CommandScene from './CommandScene';
import { getClimateStrategy } from '../../services/ai';
import { Target, Users, Map, Activity, ShieldAlert, Crosshair, ChevronRight, Globe2, Sparkles } from 'lucide-react';

export default function ClimateStrategist() {
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [strategy, setStrategy] = useState(null);
  const [activeStrategies, setActiveStrategies] = useState([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [showLegacy, setShowLegacy] = useState(false);

  const handleStrategize = async (e) => {
    e.preventDefault();
    if (!goal.trim()) return;
    
    setIsLoading(true);
    try {
      const data = await getClimateStrategy(goal);
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      setStrategy(parsedData);
      // Auto-activate all strategies by default
      setActiveStrategies(parsedData.strategies.map(s => s.id));
    } catch (error) {
      console.error(error);
      // Fallback
      setStrategy({
        experts: [
          { role: "Climate Scientist", quote: "Immediate action required to bend the emissions curve." },
          { role: "Economist", quote: "High initial CAPEX but strong long-term ROI." }
        ],
        roadmap: { phase1: "Audit & Planning", phase2: "Infrastructure Build", phase3: "Full Operation" },
        strategies: [
          { id: "s1", title: "Solar Grid", impact: 80, cost: 90, difficulty: "Hard", risk: "Supply chain delays" },
          { id: "s2", title: "Compost System", impact: 30, cost: 10, difficulty: "Easy", risk: "Low compliance" }
        ],
        legacy: { peopleImpacted: "5,000+", carbonPrevented: "10k Tons", treesEquivalent: "50,000" }
      });
      setActiveStrategies(["s1", "s2"]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStrategy = (id) => {
    setActiveStrategies(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setShowLegacy(true);
    }, 2000);
  };

  // Calculate Success Probability based on active strategies
  const successProbability = useMemo(() => {
    if (!strategy) return 0;
    if (activeStrategies.length === 0) return 15;
    
    const activeData = strategy.strategies.filter(s => activeStrategies.includes(s.id));
    const totalImpact = activeData.reduce((sum, s) => sum + Number(s.impact), 0);
    const avgCost = activeData.reduce((sum, s) => sum + Number(s.cost), 0) / activeData.length;
    
    // Magic formula for demo
    let prob = Math.min(99, (totalImpact / strategy.strategies.length) * 0.8 + (100 - avgCost) * 0.2 + (activeData.length * 5));
    return prob.toFixed(1);
  }, [strategy, activeStrategies]);

  return (
    <div className="w-full h-[85vh] min-h-[800px] relative rounded-3xl overflow-hidden bg-[#02050a] select-none shadow-2xl font-sans">
      
      {!strategy ? (
        // Input Screen
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-50 bg-[#02050a]">
          <Crosshair className="w-16 h-16 text-[#0088ff] mb-8" />
          <h1 className="text-5xl font-heading font-bold text-white uppercase tracking-widest mb-4">Climate Command Center</h1>
          <p className="text-white/50 text-sm tracking-widest uppercase mb-12">Design the future. Simulate the impact.</p>
          
          <form onSubmit={handleStrategize} className="w-full max-w-2xl flex flex-col items-center">
            <input 
              type="text" 
              placeholder="e.g., Make my college campus carbon neutral by 2030" 
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-8 py-5 text-white text-center text-lg placeholder:text-white/30 focus:outline-none focus:border-[#0088ff] transition-colors mb-8"
              autoFocus
            />
            <button 
              type="submit"
              disabled={isLoading || !goal.trim()}
              className="bg-[#0088ff] hover:bg-[#00aaff] text-white px-12 py-4 rounded-xl tracking-widest uppercase font-bold text-sm transition-all disabled:opacity-50 flex items-center gap-3 shadow-[0_0_20px_rgba(0,136,255,0.4)]"
            >
              {isLoading ? "Assembling Strategy Council..." : "Initialize Command Center"}
            </button>
          </form>
        </div>
      ) : (
        // War Room UI
        <>
          {/* 3D Galaxy Canvas */}
          <div className="absolute inset-0 z-0">
            <Canvas>
              <React.Suspense fallback={null}>
                <CommandScene 
                  strategies={strategy.strategies} 
                  activeStrategies={activeStrategies} 
                  isDeploying={isDeploying} 
                />
              </React.Suspense>
            </Canvas>
          </div>

          {/* UI Overlays */}
          <AnimatePresence>
            {!isDeploying && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 pointer-events-none p-6 grid grid-cols-12 gap-6"
              >
                
                {/* Left Column: Council & Roadmap */}
                <div className="col-span-3 flex flex-col gap-6">
                  {/* AI Strategy Council */}
                  <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 pointer-events-auto custom-scrollbar overflow-y-auto max-h-[400px]">
                    <div className="text-[#ffaa00] text-xs tracking-widest uppercase mb-4 flex items-center gap-2"><Users size={14}/> AI Strategy Council</div>
                    <div className="space-y-4">
                      {strategy.experts.map((expert, idx) => (
                        <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/10">
                          <div className="text-white font-bold text-sm mb-2">{expert.role}</div>
                          <div className="text-white/70 italic text-xs leading-relaxed">"{expert.quote}"</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Roadmap */}
                  <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 pointer-events-auto flex-1">
                    <div className="text-[#0088ff] text-xs tracking-widest uppercase mb-4 flex items-center gap-2"><Map size={14}/> Action Roadmap</div>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-1 h-full bg-[#0088ff] rounded-full"></div>
                        <div>
                          <div className="text-white/50 text-[10px] uppercase tracking-widest">Phase 1: 0-6 Months</div>
                          <div className="text-white text-sm mt-1">{strategy.roadmap.phase1}</div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-1 h-full bg-[#0088ff]/60 rounded-full"></div>
                        <div>
                          <div className="text-white/50 text-[10px] uppercase tracking-widest">Phase 2: 1-3 Years</div>
                          <div className="text-white text-sm mt-1">{strategy.roadmap.phase2}</div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-1 h-full bg-[#0088ff]/30 rounded-full"></div>
                        <div>
                          <div className="text-white/50 text-[10px] uppercase tracking-widest">Phase 3: 3-10 Years</div>
                          <div className="text-white text-sm mt-1">{strategy.roadmap.phase3}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-6" /> {/* Center Space for Galaxy */}

                {/* Right Column: Success & Sandbox */}
                <div className="col-span-3 flex flex-col gap-6">
                  {/* Mission Success Probability */}
                  <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 pointer-events-auto text-center">
                    <div className="text-white/50 text-xs tracking-widest uppercase mb-2 flex items-center justify-center gap-2"><Target size={14}/> Mission Success Probability</div>
                    <div className="text-5xl font-mono font-bold text-[#00ffaa] my-4 drop-shadow-[0_0_10px_rgba(0,255,170,0.5)]">
                      {successProbability}%
                    </div>
                    <button 
                      onClick={handleDeploy}
                      className="w-full bg-[#00ffaa] text-black font-bold uppercase tracking-widest text-sm py-3 rounded-xl hover:bg-white transition-all shadow-[0_0_15px_rgba(0,255,170,0.3)]"
                    >
                      Deploy Master Strategy
                    </button>
                  </div>

                  {/* Strategy Sandbox */}
                  <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 pointer-events-auto flex-1 custom-scrollbar overflow-y-auto max-h-[500px]">
                    <div className="text-[#ff00aa] text-xs tracking-widest uppercase mb-4 flex items-center gap-2"><Activity size={14}/> Strategy Sandbox</div>
                    <div className="space-y-3">
                      {strategy.strategies.map((s) => {
                        const isActive = activeStrategies.includes(s.id);
                        return (
                          <div 
                            key={s.id} 
                            onClick={() => toggleStrategy(s.id)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-2 ${isActive ? 'bg-[#ff00aa]/20 border-[#ff00aa] shadow-[0_0_10px_rgba(255,0,170,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                          >
                            <div className="flex justify-between items-center">
                              <div className={`font-bold text-sm ${isActive ? 'text-white' : 'text-white/60'}`}>{s.title}</div>
                              <div className={`w-4 h-4 rounded-full border ${isActive ? 'bg-[#ff00aa] border-[#ff00aa]' : 'border-white/30'}`}></div>
                            </div>
                            <div className="flex gap-2 text-[10px] font-mono uppercase">
                              <span className="text-[#00ffaa]">Impact {s.impact}</span>
                              <span className="text-[#ffaa00]">Cost {s.cost}</span>
                            </div>
                            {isActive && (
                              <div className="text-[#ff3300] text-[10px] flex items-start gap-1 mt-1 bg-[#ff3300]/10 p-2 rounded">
                                <ShieldAlert size={12} className="flex-shrink-0" />
                                <span>Risk: {s.risk}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

          {/* Legacy Reveal (Final Cinematic) */}
          <AnimatePresence>
            {showLegacy && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 pointer-events-auto"
              >
                {/* Dark overlay behind text but over the Earth */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"></div>
                
                <div className="z-10 text-center max-w-4xl">
                  <Globe2 className="w-16 h-16 text-[#00ffaa] mx-auto mb-6 animate-pulse" />
                  <h2 className="text-4xl text-white font-light tracking-[0.2em] uppercase mb-12 drop-shadow-2xl">
                    The future is not predicted. <br/> <span className="font-bold text-[#00ffaa]">It is designed.</span>
                  </h2>
                  
                  <div className="grid grid-cols-3 gap-8">
                    <div className="bg-black/60 border border-[#00ffaa]/30 p-6 rounded-2xl shadow-[0_0_30px_rgba(0,255,170,0.2)]">
                      <div className="text-white/50 text-xs tracking-widest uppercase mb-2">People Impacted</div>
                      <div className="text-3xl font-bold text-white font-mono">{strategy.legacy.peopleImpacted}</div>
                    </div>
                    <div className="bg-black/60 border border-[#00ffaa]/30 p-6 rounded-2xl shadow-[0_0_30px_rgba(0,255,170,0.2)]">
                      <div className="text-white/50 text-xs tracking-widest uppercase mb-2">Carbon Prevented</div>
                      <div className="text-3xl font-bold text-[#00ffaa] font-mono">{strategy.legacy.carbonPrevented}</div>
                    </div>
                    <div className="bg-black/60 border border-[#00ffaa]/30 p-6 rounded-2xl shadow-[0_0_30px_rgba(0,255,170,0.2)]">
                      <div className="text-white/50 text-xs tracking-widest uppercase mb-2">Trees Equivalent</div>
                      <div className="text-3xl font-bold text-white font-mono">{strategy.legacy.treesEquivalent}</div>
                    </div>
                  </div>

                  <button 
                    onClick={() => { setShowLegacy(false); setIsDeploying(false); setStrategy(null); setGoal(''); }}
                    className="mt-12 text-white/50 hover:text-white tracking-widest text-xs uppercase border-b border-white/20 pb-1 transition-colors"
                  >
                    Start New Simulation
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
