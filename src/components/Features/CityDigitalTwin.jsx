import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import CityNexusScene from './CityNexusScene';
import { getCityAdvisorInsight } from '../../services/ai';
import { Building2, Trees, Train, Factory, AlertTriangle, ShieldCheck, Milestone } from 'lucide-react';

export default function CityDigitalTwin() {
  const [policies, setPolicies] = useState({
    renewables: 20,
    transport: 30,
    forests: 10,
    industry: 80
  });
  
  const [year, setYear] = useState(2026);
  const [advisorMessage, setAdvisorMessage] = useState(null);
  const [isLoadingAdvisor, setIsLoadingAdvisor] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const debounceRef = useRef(null);

  const handlePolicyChange = (name, value) => {
    setPolicies(prev => ({ ...prev, [name]: parseInt(value) }));
  };

  // Debounced AI call
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    debounceRef.current = setTimeout(async () => {
      setIsLoadingAdvisor(true);
      try {
        const data = await getCityAdvisorInsight(policies);
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        setAdvisorMessage(parsed);
      } catch (err) {
        console.error(err);
        setAdvisorMessage({
          headline: "SYSTEM OFFLINE",
          insight: "The AI Mayor is currently offline. Maintain current sustainability protocols."
        });
      } finally {
        setIsLoadingAdvisor(false);
      }
    }, 1500); // 1.5s debounce

    return () => clearTimeout(debounceRef.current);
  }, [policies]);

  // Derived metrics
  const coreHealth = Math.max(0, Math.min(100, (policies.renewables + policies.forests + policies.transport - policies.industry + 100) / 2));
  const citizensHelped = Math.floor(coreHealth * 50000).toLocaleString();
  const carbonPrevented = Math.floor(coreHealth * 1200).toLocaleString();

  return (
    <div className="w-full h-[85vh] min-h-[800px] relative rounded-3xl overflow-hidden bg-[#02050a] select-none shadow-2xl font-sans">
      
      {/* 3D Living City */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <React.Suspense fallback={null}>
            <CityNexusScene policies={policies} year={year} isDeploying={isDeploying} />
          </React.Suspense>
        </Canvas>
      </div>

      {/* UI Overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none p-6 grid grid-cols-12 gap-6">
        
        {/* Left Column: Policy Controls */}
        <div className="col-span-3 flex flex-col gap-6">
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 pointer-events-auto">
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-widest border-b border-white/10 pb-4">Policy Control</h2>
            
            <div className="space-y-6">
              <div>
                <label className="flex items-center justify-between text-white/70 text-xs uppercase tracking-widest mb-2">
                  <span className="flex items-center gap-2"><Building2 size={14} className="text-[#00ffaa]" /> Renewables</span>
                  <span className="text-[#00ffaa] font-mono">{policies.renewables}%</span>
                </label>
                <input type="range" name="renewables" min="0" max="100" value={policies.renewables} onChange={(e) => handlePolicyChange('renewables', e.target.value)} className="w-full accent-[#00ffaa]" />
              </div>
              
              <div>
                <label className="flex items-center justify-between text-white/70 text-xs uppercase tracking-widest mb-2">
                  <span className="flex items-center gap-2"><Train size={14} className="text-[#0088ff]" /> Public Transit</span>
                  <span className="text-[#0088ff] font-mono">{policies.transport}%</span>
                </label>
                <input type="range" name="transport" min="0" max="100" value={policies.transport} onChange={(e) => handlePolicyChange('transport', e.target.value)} className="w-full accent-[#0088ff]" />
              </div>

              <div>
                <label className="flex items-center justify-between text-white/70 text-xs uppercase tracking-widest mb-2">
                  <span className="flex items-center gap-2"><Trees size={14} className="text-[#22c55e]" /> Urban Forests</span>
                  <span className="text-[#22c55e] font-mono">{policies.forests}%</span>
                </label>
                <input type="range" name="forests" min="0" max="100" value={policies.forests} onChange={(e) => handlePolicyChange('forests', e.target.value)} className="w-full accent-[#22c55e]" />
              </div>

              <div>
                <label className="flex items-center justify-between text-white/70 text-xs uppercase tracking-widest mb-2">
                  <span className="flex items-center gap-2"><Factory size={14} className="text-[#ff3300]" /> Industry</span>
                  <span className="text-[#ff3300] font-mono">{policies.industry}%</span>
                </label>
                <input type="range" name="industry" min="0" max="100" value={policies.industry} onChange={(e) => handlePolicyChange('industry', e.target.value)} className="w-full accent-[#ff3300]" />
              </div>
            </div>
          </div>

          {/* AI Mayor Advisor */}
          <div className={`bg-black/60 backdrop-blur-xl border rounded-2xl p-6 pointer-events-auto transition-colors max-h-[300px] overflow-y-auto custom-scrollbar ${coreHealth < 40 ? 'border-[#ff3300]/50 shadow-[0_0_15px_rgba(255,51,0,0.2)]' : 'border-[#00ffaa]/50 shadow-[0_0_15px_rgba(0,255,170,0.2)]'}`}>
            <div className="text-white/50 text-[10px] tracking-widest uppercase mb-4 flex items-center gap-2">
              {coreHealth < 40 ? <AlertTriangle size={14} className="text-[#ff3300]"/> : <ShieldCheck size={14} className="text-[#00ffaa]"/>} 
              AI Mayor Advisor
            </div>
            
            {isLoadingAdvisor ? (
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-2 bg-white/20 rounded"></div>
                  <div className="h-2 bg-white/20 rounded w-5/6"></div>
                </div>
              </div>
            ) : advisorMessage ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className={`font-bold mb-2 ${coreHealth < 40 ? 'text-[#ff3300]' : 'text-[#00ffaa]'}`}>{advisorMessage.headline}</div>
                <div className="text-white/80 text-sm leading-relaxed">"{advisorMessage.insight}"</div>
              </motion.div>
            ) : null}
          </div>
        </div>

        {/* Center: Open Space */}
        <div className="col-span-6 flex flex-col items-center justify-between py-12">
           <h1 className="text-5xl font-light tracking-[0.3em] uppercase text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">Future City Nexus</h1>
           
           {isDeploying && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }} 
               animate={{ opacity: 1, scale: 1 }}
               className="text-center bg-black/80 backdrop-blur-xl border border-[#00ffaa]/50 p-12 rounded-3xl shadow-[0_0_50px_rgba(0,255,170,0.3)] pointer-events-auto"
             >
               <h2 className="text-3xl text-white font-light tracking-widest mb-8">You didn't simulate a city.<br/><span className="font-bold text-[#00ffaa]">You designed a future.</span></h2>
               <div className="flex gap-12 justify-center">
                 <div>
                   <div className="text-[#00ffaa] text-5xl font-bold font-mono mb-2">{citizensHelped}</div>
                   <div className="text-white/50 text-xs uppercase tracking-widest">Citizens Helped</div>
                 </div>
                 <div>
                   <div className="text-[#00ffaa] text-5xl font-bold font-mono mb-2">{carbonPrevented}</div>
                   <div className="text-white/50 text-xs uppercase tracking-widest">Carbon Prevented (Tons)</div>
                 </div>
               </div>
               <button 
                 onClick={() => setIsDeploying(false)}
                 className="mt-12 text-white/50 hover:text-white tracking-widest text-xs uppercase border-b border-white/20 pb-1"
               >
                 Return to Simulation
               </button>
             </motion.div>
           )}
        </div>

        {/* Right Column: Legacy & Timeline */}
        <div className="col-span-3 flex flex-col justify-end gap-6">
          
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 pointer-events-auto">
            <div className="text-[#ffaa00] text-xs tracking-widest uppercase mb-4 flex items-center gap-2"><Milestone size={14}/> City Health Core</div>
            <div className="text-6xl font-mono font-bold text-white mb-2">{coreHealth.toFixed(0)}<span className="text-2xl text-white/50">%</span></div>
            
            {/* Health Bar */}
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-4">
              <div 
                className={`h-full transition-all duration-1000 ${coreHealth < 40 ? 'bg-[#ff3300]' : coreHealth < 70 ? 'bg-[#ffaa00]' : 'bg-[#00ffaa]'}`} 
                style={{ width: `${coreHealth}%` }}
              ></div>
            </div>

            <button 
              onClick={() => setIsDeploying(true)}
              disabled={coreHealth < 80}
              className={`w-full mt-8 py-4 rounded-xl uppercase tracking-widest font-bold text-sm transition-all shadow-[0_0_20px_rgba(0,255,170,0.2)] ${coreHealth >= 80 ? 'bg-[#00ffaa] text-black hover:bg-white' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
            >
              {coreHealth >= 80 ? 'Lock In Future' : 'Requires 80% Health'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
