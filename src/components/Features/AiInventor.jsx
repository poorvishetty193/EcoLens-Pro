import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import LabScene from './LabScene';
import { getSustainabilityInventor } from '../../services/ai';
import { Lightbulb, Dna, Rocket, Briefcase, Zap, Globe, Cpu } from 'lucide-react';

export default function AiInventor() {
  const [problem, setProblem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [labState, setLabState] = useState('input'); // input, analyzing, fusion, hologram, launch
  const [startup, setStartup] = useState(null);
  const [usersToSimulate, setUsersToSimulate] = useState(1000);

  const handleInvent = async (e) => {
    e.preventDefault();
    if (!problem.trim()) return;
    
    setIsLoading(true);
    setLabState('analyzing');
    
    try {
      // Simulated Idea Generation Ceremony Timing
      setTimeout(() => setLabState('fusion'), 2000);
      
      const data = await getSustainabilityInventor(problem);
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      setStartup(parsed);
      
      setTimeout(() => {
        setLabState('hologram');
        setIsLoading(false);
      }, 4000);
      
    } catch (err) {
      console.error(err);
      // Fallback
      setStartup({
        dna: { name: "AeroFilter AI", mission: "Eradicating urban smog using autonomous drone nets.", tech: "Robotics & AI", innovationScore: 94, fundingScore: 88 },
        investors: [
          { role: "Climate Investor", quote: "High upfront cost, but municipal contracts will drive massive recurring revenue.", verdict: "FUND" },
          { role: "Engineer", quote: "Battery density is the main bottleneck. We need ultra-light solid state.", verdict: "PASS" },
          { role: "Policy Expert", quote: "Aviation authority clearance will take 2-3 years minimum.", verdict: "PASS" },
          { role: "Customer", quote: "I would pay higher taxes if I could actually see the sky in my city.", verdict: "FUND" }
        ],
        impact: { metricName: "Kg of PM2.5 Captured", valuePerUser: 50 },
        legacy: "By 2050, the skies over major metropolises returned to crystal blue, redefining urban existence."
      });
      setTimeout(() => {
        setLabState('hologram');
        setIsLoading(false);
      }, 4000);
    }
  };

  const handleLaunch = () => {
    setLabState('launch');
  };

  const totalImpact = (usersToSimulate * (startup?.impact?.valuePerUser || 0)).toLocaleString();

  return (
    <div className="w-full h-[85vh] min-h-[800px] relative rounded-3xl overflow-hidden bg-[#03050a] select-none shadow-2xl font-sans text-white">
      
      {/* Background 3D Reactor */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <React.Suspense fallback={null}>
            <LabScene stage={labState} />
          </React.Suspense>
        </Canvas>
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none p-8 flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
            <Cpu className="text-[#00ffff] w-6 h-6" />
            <span className="font-light tracking-[0.2em] uppercase">Climate Innovation Lab</span>
          </div>
          {labState !== 'input' && (
            <div className="text-white/50 text-xs tracking-widest uppercase animate-pulse">
              System Status: {labState === 'analyzing' ? 'Scanning Problem...' : labState === 'fusion' ? 'Synthesizing Tech...' : 'Startup Initialized'}
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          
          {/* INPUT STATE */}
          {labState === 'input' && (
            <motion.div 
              key="input"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center pointer-events-auto max-w-2xl mx-auto w-full text-center"
            >
              <Lightbulb className="w-16 h-16 text-[#00ffff] mb-6 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]" />
              <h1 className="text-5xl font-light tracking-[0.1em] mb-4">Invent the Future</h1>
              <p className="text-white/50 tracking-widest text-sm uppercase mb-12">Submit a crisis. The lab will synthesize a startup solution.</p>
              
              <form onSubmit={handleInvent} className="w-full relative">
                <input 
                  type="text" 
                  placeholder="e.g. Ocean microplastics..." 
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-2xl px-8 py-5 text-lg placeholder:text-white/30 focus:outline-none focus:border-[#00ffff] transition-colors pr-40"
                  autoFocus
                />
                <button 
                  type="submit"
                  disabled={!problem.trim() || isLoading}
                  className="absolute right-2 top-2 bottom-2 bg-[#00ffff] text-black hover:bg-white px-8 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_15px_rgba(0,255,255,0.3)] disabled:opacity-50"
                >
                  Synthesize
                </button>
              </form>
            </motion.div>
          )}

          {/* CEREMONY STATES (Analyzing / Fusion) */}
          {(labState === 'analyzing' || labState === 'fusion') && (
            <motion.div 
              key="ceremony"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center pointer-events-none"
            >
              <h2 className="text-4xl font-light tracking-[0.3em] uppercase drop-shadow-2xl">
                {labState === 'analyzing' ? 'Analyzing Crisis Vectors...' : 'Fusing Disciplinary Matrices...'}
              </h2>
            </motion.div>
          )}

          {/* HOLOGRAM STATE (The Startup is born) */}
          {labState === 'hologram' && startup && (
            <motion.div 
              key="hologram"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex-1 grid grid-cols-12 gap-8 items-center mt-8 pointer-events-none min-h-0 overflow-hidden"
            >
              {/* Left: Startup DNA */}
              <div className="col-span-4 bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl pointer-events-auto h-full max-h-full overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-2 text-[#00ffcc] text-xs uppercase tracking-widest mb-6"><Dna size={16}/> Startup DNA</div>
                
                <h2 className="text-4xl font-bold mb-2">{startup.dna.name}</h2>
                <p className="text-white/70 italic text-sm mb-6">"{startup.dna.mission}"</p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Core Tech</div>
                    <div className="font-mono text-sm">{startup.dna.tech}</div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] uppercase tracking-widest mb-1">
                      <span className="text-white/40">Innovation Score</span>
                      <span className="text-[#00ffcc]">{startup.dna.innovationScore}/100</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full"><div className="h-full bg-[#00ffcc]" style={{width: `${startup.dna.innovationScore}%`}}></div></div>
                  </div>
                </div>

                {/* Impact Simulator */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 mt-8">
                  <div className="text-white/50 text-[10px] uppercase tracking-widest mb-4">Simulate Adoption</div>
                  <input type="range" min="1000" max="10000000" step="10000" value={usersToSimulate} onChange={(e)=>setUsersToSimulate(parseInt(e.target.value))} className="w-full accent-[#00aaff] mb-4"/>
                  <div className="text-3xl font-mono text-[#00aaff] mb-1">{totalImpact}</div>
                  <div className="text-[10px] uppercase tracking-widest text-[#00aaff]">{startup.impact.metricName}</div>
                </div>
              </div>

              {/* Middle: Open space for Hologram, Button at bottom */}
              <div className="col-span-4 h-full flex flex-col justify-end items-center pb-8 pointer-events-auto">
                <button 
                  onClick={handleLaunch}
                  className="bg-[#00aaff] text-black px-12 py-4 rounded-xl font-bold uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(0,170,255,0.4)] hover:bg-white hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Rocket size={18} /> Launch Startup
                </button>
              </div>

              {/* Right: Board of Investors */}
              <div className="col-span-4 bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl pointer-events-auto h-full overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-2 text-[#ffaa00] text-xs uppercase tracking-widest mb-6"><Briefcase size={16}/> AI Board of Investors</div>
                
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/10">
                  <div className="text-white/50 text-[10px] uppercase tracking-widest">Aggregate Funding Score</div>
                  <div className="text-3xl font-bold text-[#ffaa00]">{startup.dna.fundingScore}/100</div>
                </div>

                <div className="space-y-6">
                  {startup.investors.map((inv, i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-xs font-bold uppercase tracking-widest">{inv.role}</div>
                        <div className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest ${inv.verdict === 'FUND' ? 'bg-[#00ffcc]/20 text-[#00ffcc]' : 'bg-red-500/20 text-red-500'}`}>
                          {inv.verdict}
                        </div>
                      </div>
                      <p className="text-sm text-white/70 italic">"{inv.quote}"</p>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

          {/* LAUNCH STATE (Earth Legacy Reveal) */}
          {labState === 'launch' && startup && (
            <motion.div 
              key="launch"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}
              className="absolute inset-0 z-50 flex items-center justify-center p-12 pointer-events-auto bg-black/40 backdrop-blur-sm"
            >
              <div className="max-w-4xl w-full text-center">
                <Globe className="w-24 h-24 text-[#00ffff] mx-auto mb-8 animate-pulse drop-shadow-[0_0_30px_rgba(0,255,255,0.5)]" />
                <h2 className="text-sm text-[#00ffff] tracking-[0.4em] uppercase mb-8">The Year is 2050</h2>
                
                <p className="text-3xl md:text-5xl font-serif italic text-white leading-relaxed mb-16 drop-shadow-2xl">
                  "{startup.legacy}"
                </p>

                <div className="flex justify-center gap-12 mb-16">
                  <div>
                    <div className="text-5xl font-mono text-[#00ffcc] mb-2">{totalImpact}</div>
                    <div className="text-white/50 text-xs uppercase tracking-widest">{startup.impact.metricName}</div>
                  </div>
                </div>

                <button 
                  onClick={() => { setLabState('input'); setStartup(null); setProblem(''); }}
                  className="text-white/50 hover:text-white uppercase tracking-widest text-xs border-b border-white/20 pb-1"
                >
                  Return to Lab
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
}
