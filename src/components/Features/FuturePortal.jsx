import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import PortalScene from './PortalScene';
import { getFutureProjections } from '../../services/ai';
import { Zap, Clock, Globe, FastForward, Activity, Users, TreeDeciduous } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

const Typewriter = ({ text, speed = 30, delay = 0 }) => {
  const [displayed, setDisplayed] = useState("");
  
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.substring(0, i));
        i++;
        if (i > text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, speed, delay]);

  return <span>{displayed}</span>;
};

export default function FuturePortal() {
  const [scenario, setScenario] = useState('');
  const [stage, setStage] = useState('input'); // input, portal-spawning, portal-entry, timeline, collapse
  const [portalData, setPortalData] = useState(null);
  const [timeIndex, setTimeIndex] = useState(0);
  const { updateHealth } = useSimulation();

  const handleOpenPortal = async (e) => {
    e.preventDefault();
    if (!scenario.trim()) return;
    
    setStage('portal-spawning');
    
    try {
      const data = await getFutureProjections(scenario);
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      setPortalData(parsed);
      
      // Sequence: Spin up -> Enter -> Timeline
      setTimeout(() => setStage('portal-entry'), 3000);
      setTimeout(() => setStage('timeline'), 6000);
      
    } catch (err) {
      console.error(err);
      // Fallback timeline
      setPortalData({
        isPositiveTimeline: true,
        timeline: [
          {
            year: 2030, earthState: { color: "#00ffcc", atmosphere: 0.5 },
            historicalEvent: "Global Renewable Grid Initialized",
            civilizationState: "Cities begin massive retrofitting projects. Combustion engines banned in urban centers.",
            narratorText: "In 2030, the great transition finally began. The sky above Los Angeles was clear for the first time in a century.",
            childLife: "Age 10: Learning about 'smog' in history class as a thing of the past.",
            stats: { treesRestored: 5000000, carbonPrevented: 120 }
          },
          {
            year: 2050, earthState: { color: "#00aaff", atmosphere: 0.8 },
            historicalEvent: "First Carbon-Negative Megacity",
            civilizationState: "Fusion reactors provide post-scarcity energy. Vertical forests dominate skylines.",
            narratorText: "By 2050, we weren't just stopping the damage. We were actively healing the planet.",
            childLife: "Age 30: Working in a high-tech regenerative agriculture hub outside Neo-Tokyo.",
            stats: { treesRestored: 25000000, carbonPrevented: 800 }
          }
        ],
        collapseMessage: "This timeline does not exist yet. But it can."
      });
      setTimeout(() => setStage('portal-entry'), 3000);
      setTimeout(() => setStage('timeline'), 6000);
    }
  };

  const handleEndSimulation = () => {
    setStage('collapse');
    if (portalData?.isPositiveTimeline) {
      updateHealth(15);
    } else {
      updateHealth(-15);
    }
  };

  const activeDecade = portalData?.timeline[timeIndex];

  return (
    <div className="w-full h-[85vh] min-h-[800px] relative rounded-3xl overflow-hidden bg-black select-none shadow-2xl font-sans text-white">
      
      {/* 3D Portal & Earth Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <React.Suspense fallback={null}>
            <PortalScene stage={stage} earthState={activeDecade?.earthState} />
          </React.Suspense>
        </Canvas>
      </div>

      {/* Cinematic UI Overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between">
        
        <AnimatePresence mode="wait">
          
          {/* INPUT STAGE */}
          {stage === 'input' && (
            <motion.div 
              key="input"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-black/60 backdrop-blur-sm pointer-events-auto"
            >
              <Zap className="w-20 h-20 text-[#00ffcc] mb-8 animate-pulse drop-shadow-[0_0_20px_rgba(0,255,204,0.5)]" />
              <h1 className="text-6xl font-light tracking-[0.2em] uppercase mb-4 text-center">The Future Earth Portal</h1>
              <p className="text-white/50 tracking-widest text-sm uppercase mb-12">Step into the future your choices create.</p>
              
              <form onSubmit={handleOpenPortal} className="w-full max-w-2xl flex flex-col items-center">
                <input 
                  type="text" 
                  placeholder="e.g. 100% global renewable energy..." 
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-8 py-6 text-center text-xl placeholder:text-white/30 focus:outline-none focus:border-[#00ffcc] transition-colors mb-8"
                />
                <button 
                  type="submit"
                  disabled={!scenario.trim()}
                  className="bg-[#00ffcc] text-black hover:bg-white px-16 py-5 rounded-xl tracking-[0.2em] uppercase font-bold text-lg transition-all disabled:opacity-50 shadow-[0_0_30px_rgba(0,255,204,0.4)]"
                >
                  Open Portal
                </button>
              </form>
            </motion.div>
          )}

          {/* PORTAL SPAWNING STAGE */}
          {stage === 'portal-spawning' && (
            <motion.div 
              key="spawning"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <h2 className="text-2xl font-light tracking-[0.5em] uppercase text-white animate-pulse">
                Stabilizing Wormhole...
              </h2>
            </motion.div>
          )}
          
          {/* PORTAL ENTRY STAGE */}
          {stage === 'portal-entry' && (
            <motion.div 
              key="entry"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <h2 className="text-4xl font-bold tracking-[0.3em] uppercase text-white drop-shadow-2xl">
                Entering Timeline...
              </h2>
            </motion.div>
          )}

          {/* TIMELINE JOURNEY STAGE */}
          {stage === 'timeline' && activeDecade && (
            <motion.div 
              key={`timeline-${timeIndex}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col justify-between p-10 pointer-events-none"
            >
              {/* Header: Year & Narrator */}
              <div className="max-w-3xl mx-auto text-center space-y-4">
                <div className="inline-block border border-white/20 bg-black/40 backdrop-blur-md px-8 py-2 rounded-full">
                  <span className="text-[#00ffcc] font-mono text-3xl font-bold tracking-widest">{activeDecade.year}</span>
                </div>
                <div className="bg-black/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                  <p className="text-xl font-serif italic text-white/90 leading-relaxed">
                    "<Typewriter text={activeDecade.narratorText} speed={25} />"
                  </p>
                </div>
              </div>

              {/* Lower UI Grid */}
              <div className="grid grid-cols-12 gap-6 items-end pointer-events-auto h-full max-h-[350px]">
                
                {/* Left: Historical Chapter & Civilization */}
                <div className="col-span-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full overflow-y-auto custom-scrollbar flex flex-col gap-6">
                  <div>
                    <div className="text-[#00ffcc] text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2"><Globe size={14}/> Historical Archive</div>
                    <h3 className="text-2xl font-bold leading-tight">{activeDecade.historicalEvent}</h3>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="text-white/40 text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2"><Activity size={14}/> Civilization State</div>
                    <p className="text-sm text-white/80">{activeDecade.civilizationState}</p>
                  </div>
                </div>

                {/* Middle: Child Generation Mode */}
                <div className="col-span-4 h-full flex flex-col justify-end">
                  <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00aaff] to-transparent"></div>
                    <div className="text-[#00aaff] text-[10px] uppercase tracking-widest mb-4 flex items-center justify-center gap-2"><Users size={14}/> Child Generation Mode</div>
                    <p className="text-center font-serif italic text-lg leading-relaxed">"{activeDecade.childLife}"</p>
                  </div>
                </div>

                {/* Right: Impact & Controls */}
                <div className="col-span-4 h-full flex flex-col justify-between">
                  <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
                    <div className="text-white/40 text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2"><TreeDeciduous size={14}/> Planetary Impact</div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-sm text-white/60">Trees Restored</span>
                        <span className="text-xl font-mono text-[#00ffcc]">+{activeDecade.stats.treesRestored.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-sm text-white/60">Megatons CO2 Prevented</span>
                        <span className="text-xl font-mono text-[#00ffcc]">+{activeDecade.stats.carbonPrevented.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      if (timeIndex < portalData.timeline.length - 1) {
                        setTimeIndex(timeIndex + 1);
                      } else {
                        handleEndSimulation();
                      }
                    }}
                    className="w-full bg-white text-black py-5 rounded-2xl uppercase tracking-[0.2em] font-bold transition-all hover:bg-white/90 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] mt-4"
                  >
                    {timeIndex < portalData.timeline.length - 1 ? <><FastForward size={18}/> Jump to Next Era</> : "Close Portal"}
                  </button>
                </div>

              </div>
            </motion.div>
          )}

          {/* COLLAPSE STAGE */}
          {stage === 'collapse' && (
            <motion.div 
              key="collapse"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 3 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-12 pointer-events-auto bg-black/90 backdrop-blur-xl"
            >
              <h2 className="text-4xl md:text-6xl font-serif italic text-white leading-relaxed text-center max-w-4xl drop-shadow-2xl mb-12">
                "{portalData.collapseMessage}"
              </h2>

              <button 
                onClick={() => { setStage('input'); setPortalData(null); setScenario(''); }}
                className="text-white/50 hover:text-white uppercase tracking-widest text-sm border-b border-white/20 pb-1 transition-colors"
              >
                Return to the Present
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
