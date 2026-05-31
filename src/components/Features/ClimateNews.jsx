import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import FutureCastScene from './FutureCastScene';
import { getClimateNews } from '../../services/ai';
import { Radio, AlertTriangle, Play, FastForward, Globe2, Activity, Users, TrendingUp } from 'lucide-react';

const Typewriter = ({ text, speed = 20, delay = 0 }) => {
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

export default function ClimateNews() {
  const [scenario, setScenario] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [broadcast, setBroadcast] = useState(null);
  
  // Player State
  const [stage, setStage] = useState('input'); // input, live, legacy
  const [timeIndex, setTimeIndex] = useState(0);
  const [activeChannel, setActiveChannel] = useState('environment'); // environment, economy, society

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!scenario.trim()) return;
    
    setIsLoading(true);
    try {
      const data = await getClimateNews(scenario);
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      setBroadcast(parsed);
      setStage('live');
      setTimeIndex(0);
    } catch (err) {
      console.error(err);
      // Fallback Broadcast
      setBroadcast({
        isEmergency: false,
        timeline: [
          {
            year: 2030, breakingHeadline: "GLOBAL EMISSIONS FALL BELOW CRITICAL THRESHOLD", narratorIntro: "Good evening. We are broadcasting live from 2030, where the world is seeing unprecedented shifts in global infrastructure.",
            channels: {
              environment: { reporter: "Dr. Aris", headline: "Renewable Grid Surpasses 80%", detail: "The massive solar expansion in the Sahara has finally linked with the European supergrid." },
              economy: { reporter: "J. Vance", headline: "Fossil Fuel Stocks Plummet", detail: "The transition is destroying legacy portfolios while green-tech unicorns surge." },
              society: { reporter: "M. Lin", headline: "Urban Air Quality at 50-Year High", detail: "Citizens are reporting clear skies in Mumbai, Beijing, and Los Angeles for the first time in a generation." }
            },
            interview: { name: "Elena Rostova", role: "Urban Planner", quote: "We didn't think it was possible to retrofit the entire city this fast. It's a miracle." },
            marketImpact: "+15% Renewable Growth"
          },
          {
            year: 2050, breakingHeadline: "FIRST CARBON-NEGATIVE MEGACITY ANNOUNCED", narratorIntro: "Welcome to 2050. The transition is complete, but we are now dealing with the logistics of active planetary cooling.",
            channels: {
              environment: { reporter: "Dr. Aris", headline: "Ocean Acidification Reversing", detail: "Massive kelp-drone fleets have successfully restored pH balances in the Pacific." },
              economy: { reporter: "J. Vance", headline: "Post-Scarcity Energy Grid Active", detail: "With fusion reactors coming online, energy is nearly free in developed nations." },
              society: { reporter: "M. Lin", headline: "Climate Refugees Returning Home", detail: "Stabilized sea levels mean millions can return to historic coastal zones." }
            },
            interview: { name: "David Chen", role: "Citizen", quote: "My kids will never know what a combustion engine smells like." },
            marketImpact: "Global Fossil Fleet Retired"
          }
        ],
        finalLegacy: "The defining moment of the 21st century was not when we reached the brink of destruction, but when we decided to pull back and rebuild the world."
      });
      setStage('live');
      setTimeIndex(0);
    } finally {
      setIsLoading(false);
    }
  };

  const activeYearData = broadcast?.timeline[timeIndex];
  const channelData = activeYearData?.channels[activeChannel];

  return (
    <div className="w-full h-[85vh] min-h-[800px] relative rounded-3xl overflow-hidden bg-black select-none shadow-2xl font-sans text-white">
      
      {/* 3D News Globe Background */}
      {stage !== 'input' && (
        <div className="absolute inset-0 z-0">
          <Canvas>
            <React.Suspense fallback={null}>
              <FutureCastScene 
                isEmergency={broadcast?.isEmergency} 
                activeChannel={activeChannel} 
              />
            </React.Suspense>
          </Canvas>
        </div>
      )}

      {/* Overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between">
        
        <AnimatePresence mode="wait">
          
          {/* INPUT STAGE */}
          {stage === 'input' && (
            <motion.div 
              key="input"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[#02050a] pointer-events-auto"
            >
              <Radio className="w-16 h-16 text-[#00aaff] mb-8 animate-pulse" />
              <h1 className="text-5xl font-light tracking-[0.2em] uppercase mb-4 text-center">FutureCast Network</h1>
              <p className="text-white/50 tracking-widest text-sm uppercase mb-12">Establish transmission link to future timelines.</p>
              
              <form onSubmit={handleConnect} className="w-full max-w-2xl flex flex-col items-center">
                <input 
                  type="text" 
                  placeholder="e.g., Global ban on single-use plastic..." 
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-8 py-5 text-center text-lg placeholder:text-white/30 focus:outline-none focus:border-[#00aaff] transition-colors mb-8"
                />
                <button 
                  type="submit"
                  disabled={isLoading || !scenario.trim()}
                  className="bg-[#00aaff] text-black hover:bg-white px-12 py-4 rounded-xl tracking-widest uppercase font-bold text-sm transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(0,170,255,0.4)]"
                >
                  {isLoading ? "Establishing Uplink..." : "Connect to the Future"}
                </button>
              </form>
            </motion.div>
          )}

          {/* LIVE BROADCAST STAGE */}
          {stage === 'live' && activeYearData && (
            <motion.div 
              key={`live-${timeIndex}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col justify-between p-8 pointer-events-none"
            >
              {/* Header: Breaking News & Narrator */}
              <div className="max-w-4xl mx-auto w-full space-y-6">
                <div className={`border-l-4 p-4 bg-black/60 backdrop-blur-md ${broadcast.isEmergency ? 'border-red-500' : 'border-[#00ffaa]'}`}>
                  <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-2">
                    {broadcast.isEmergency ? <AlertTriangle className="text-red-500 w-4 h-4" /> : <Radio className="text-[#00ffaa] w-4 h-4 animate-pulse" />}
                    <span className={broadcast.isEmergency ? 'text-red-500' : 'text-[#00ffaa]'}>
                      Live from {activeYearData.year}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold uppercase tracking-wide leading-tight">
                    {activeYearData.breakingHeadline}
                  </h2>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                  <p className="text-lg font-serif italic text-white/80 leading-relaxed">
                    "<Typewriter text={activeYearData.narratorIntro} speed={30} />"
                  </p>
                </div>
              </div>

              {/* Lower Thirds: Channels & Reports */}
              <div className="grid grid-cols-12 gap-8 items-end pointer-events-auto">
                
                {/* Channel Switcher */}
                <div className="col-span-3 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col gap-2">
                  <div className="text-white/40 text-[10px] uppercase tracking-widest mb-2 px-2">Network Channels</div>
                  {[
                    { id: 'environment', icon: <Globe2 size={16}/>, label: 'Environment' },
                    { id: 'economy', icon: <TrendingUp size={16}/>, label: 'Economy' },
                    { id: 'society', icon: <Users size={16}/>, label: 'Society' }
                  ].map(ch => (
                    <button 
                      key={ch.id}
                      onClick={() => setActiveChannel(ch.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl uppercase tracking-widest text-xs font-bold transition-colors ${activeChannel === ch.id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                    >
                      {ch.icon} {ch.label}
                    </button>
                  ))}
                </div>

                {/* Correspondent Report */}
                <div className="col-span-6 bg-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl relative overflow-hidden h-full max-h-[300px] overflow-y-auto custom-scrollbar">
                  <div className={`absolute top-0 left-0 w-1 h-full ${activeChannel === 'environment' ? 'bg-[#00ffaa]' : activeChannel === 'economy' ? 'bg-[#ffaa00]' : 'bg-[#00aaff]'}`}></div>
                  <div className="text-white/50 text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Activity size={14} /> Field Report: {channelData?.reporter}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{channelData?.headline}</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-6">{channelData?.detail}</p>
                  
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Exclusive Interview: {activeYearData.interview.name} ({activeYearData.interview.role})</div>
                    <p className="text-sm font-serif italic text-white/90">"{activeYearData.interview.quote}"</p>
                  </div>
                </div>

                {/* Time Transmission Controls */}
                <div className="col-span-3 flex flex-col gap-4">
                  <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl text-center">
                    <div className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Market Impact</div>
                    <div className="text-[#00ffcc] font-mono font-bold text-lg uppercase">{activeYearData.marketImpact}</div>
                  </div>

                  <button 
                    onClick={() => {
                      if (timeIndex < broadcast.timeline.length - 1) {
                        setTimeIndex(timeIndex + 1);
                      } else {
                        setStage('legacy');
                      }
                    }}
                    className="w-full bg-white text-black py-4 rounded-xl uppercase tracking-widest font-bold text-sm transition-all hover:bg-white/90 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  >
                    {timeIndex < broadcast.timeline.length - 1 ? <><FastForward size={16}/> Next Decade</> : "End Transmission"}
                  </button>
                </div>

              </div>
            </motion.div>
          )}

          {/* LEGACY STAGE */}
          {stage === 'legacy' && (
            <motion.div 
              key="legacy"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}
              className="absolute inset-0 flex items-center justify-center p-12 pointer-events-auto bg-black/80 backdrop-blur-md"
            >
              <div className="max-w-4xl w-full text-center">
                <Radio className="w-16 h-16 text-[#00aaff] mx-auto mb-8" />
                <h2 className="text-sm text-[#00aaff] tracking-[0.4em] uppercase mb-8">Transmission Concluded</h2>
                
                <p className="text-3xl md:text-5xl font-serif italic text-white leading-relaxed mb-16 drop-shadow-2xl">
                  "{broadcast.finalLegacy}"
                </p>

                <div className="text-white/50 tracking-[0.3em] uppercase text-sm mb-16">
                  History is not written yet.
                </div>

                <button 
                  onClick={() => { setStage('input'); setBroadcast(null); setScenario(''); }}
                  className="text-white/50 hover:text-white uppercase tracking-widest text-xs border-b border-white/20 pb-1 transition-colors"
                >
                  Return to Present
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
}
