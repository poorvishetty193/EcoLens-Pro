import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '../../context/SimulationContext';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import CampaignScene from './CampaignScene';
import { getMissionBriefing } from '../../services/ai';
import { Target, ShieldAlert, Crosshair, X, Globe2, Sparkles, Activity } from 'lucide-react';

const CAMPAIGNS_LIST = ['amazon', 'coral', 'plastic', 'renewable'];

export default function EcoQuests() {
  const { completedQuests, completeQuest, updateHealth } = useSimulation(); // Mapping completedQuests to campaigns
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [briefing, setBriefing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFinalReveal, setShowFinalReveal] = useState(false);

  // Check if all campaigns are done
  useEffect(() => {
    const allDone = CAMPAIGNS_LIST.every(id => completedQuests.includes(id));
    if (allDone && CAMPAIGNS_LIST.length > 0) {
      setShowFinalReveal(true);
    }
  }, [completedQuests]);

  const handleSelectCampaign = async (campaign) => {
    if (completedQuests.includes(campaign.id)) return; // Already completed
    setActiveCampaign(campaign.id);
    setBriefing(null);
    setIsLoading(true);

    try {
      const data = await getMissionBriefing(campaign.name);
      setBriefing(data);
    } catch (err) {
      setBriefing({
        situation: "Data corrupted. Immediate intervention required.",
        objective: "Restore the ecosystem.",
        outcome: "Planetary stabilization."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeploy = () => {
    if (activeCampaign) {
      completeQuest(activeCampaign, 20); // Adds to completed list and boosts health
      setActiveCampaign(null);
    }
  };

  // Calculate Recovery Index (0 to 100 based on completed campaigns)
  const recoveryIndex = (completedQuests.filter(q => CAMPAIGNS_LIST.includes(q)).length / CAMPAIGNS_LIST.length) * 100;

  return (
    <div className="w-full h-[85vh] min-h-[800px] relative rounded-3xl overflow-hidden bg-[#02050a] select-none border border-white/10 shadow-2xl">
      
      {/* 3D Holographic Earth */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <React.Suspense fallback={null}>
            <CampaignScene 
              completedCampaigns={completedQuests} 
              activeCampaign={activeCampaign} 
              onSelectCampaign={handleSelectCampaign} 
            />
            <OrbitControls enableZoom={true} minDistance={4} maxDistance={15} autoRotate={!activeCampaign} autoRotateSpeed={0.5} />
          </React.Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none p-6 flex flex-col justify-between">
        
        {/* Top Header & Planet Recovery Index */}
        <div className="flex justify-between items-start pointer-events-auto">
          <div className="bg-black/50 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 flex items-center gap-4">
            <Globe2 className="text-[#0088ff] w-8 h-8" />
            <div>
              <h1 className="text-white font-heading font-bold text-xl tracking-widest uppercase">
                Mission Control
              </h1>
              <p className="text-white/50 text-xs tracking-widest uppercase mt-1">Planet Restoration Campaigns</p>
            </div>
          </div>

          <div className="bg-black/50 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 flex items-center gap-6">
            <div className="text-right">
              <div className="text-white/50 text-xs tracking-widest uppercase mb-1">Recovery Index</div>
              <div className="text-3xl font-mono font-bold text-[#00ffaa]">{recoveryIndex.toFixed(0)}%</div>
            </div>
            <div className="h-10 w-[1px] bg-white/20"></div>
            <div className="flex gap-2">
              {[...Array(CAMPAIGNS_LIST.length)].map((_, i) => (
                <div key={i} className={`w-3 h-8 rounded-sm ${i < (recoveryIndex / 100) * CAMPAIGNS_LIST.length ? 'bg-[#00ffaa] shadow-[0_0_10px_rgba(0,255,170,0.5)]' : 'bg-white/10'}`}></div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Mission Commander Sidebar */}
        <AnimatePresence>
          {activeCampaign && (
            <motion.div 
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              className="absolute left-6 top-32 bottom-6 w-96 bg-black/80 backdrop-blur-2xl border border-white/10 z-50 p-6 flex flex-col pointer-events-auto rounded-2xl custom-scrollbar overflow-y-auto"
            >
              <button onClick={() => setActiveCampaign(null)} className="absolute top-4 right-4 text-white/50 hover:text-white">
                <X size={20} />
              </button>
              
              <div className="text-[#ffaa00] text-xs tracking-widest uppercase mb-4 flex items-center gap-2">
                <ShieldAlert size={14} /> Active Crisis Zone
              </div>
              
              <h2 className="text-3xl font-heading font-bold text-white mb-6 uppercase tracking-wider border-b border-white/10 pb-4">
                {activeCampaign.replace('-', ' ')}
              </h2>
              
              {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-white/50 font-mono text-sm uppercase tracking-widest animate-pulse gap-4">
                  <Activity className="w-8 h-8 text-[#0088ff]" />
                  Awaiting AI Briefing...
                </div>
              ) : briefing && (
                <div className="space-y-6 flex-1 text-sm">
                  <div>
                    <div className="text-white/40 text-xs uppercase tracking-widest mb-2 font-mono flex items-center gap-2"><Target size={12}/> Situation Report</div>
                    <p className="text-white/90 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                      {briefing.situation}
                    </p>
                  </div>
                  <div>
                    <div className="text-white/40 text-xs uppercase tracking-widest mb-2 font-mono flex items-center gap-2"><Crosshair size={12}/> Primary Objective</div>
                    <p className="text-[#00ffaa] font-medium leading-relaxed bg-[#00ffaa]/10 p-4 rounded-xl border border-[#00ffaa]/20">
                      {briefing.objective}
                    </p>
                  </div>

                  {/* Future Impact Projection */}
                  <div className="border-t border-white/10 pt-4 mt-6">
                    <div className="text-white/40 text-xs uppercase tracking-widest mb-4 font-mono">Future Impact Projection</div>
                    <div className="flex justify-between items-end gap-2">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-2 bg-[#0088ff]/40 rounded-t-sm"></div>
                        <span className="text-white/50 text-[10px] font-mono">2030</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-16 w-2 bg-[#0088ff]/70 rounded-t-sm"></div>
                        <span className="text-white/50 text-[10px] font-mono">2040</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-24 w-2 bg-[#0088ff] rounded-t-sm shadow-[0_0_10px_rgba(0,136,255,0.5)]"></div>
                        <span className="text-[#0088ff] font-bold text-xs font-mono">2050</span>
                      </div>
                      <div className="flex-1 ml-4 text-white/80 italic text-xs leading-relaxed border-l border-white/10 pl-4 py-2">
                        "{briefing.outcome}"
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button 
                onClick={handleDeploy}
                disabled={isLoading}
                className="mt-6 w-full py-4 bg-[#0088ff] hover:bg-[#00aaff] text-white font-bold tracking-widest uppercase rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,136,255,0.4)] hover:shadow-[0_0_30px_rgba(0,136,255,0.6)] hover:-translate-y-1"
              >
                Deploy Restoration Mission
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instruction Footer */}
        {!activeCampaign && !showFinalReveal && (
          <div className="pointer-events-auto text-center w-full pb-4">
            <span className="bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-white/60 text-xs uppercase tracking-widest font-mono shadow-xl animate-pulse">
              Select a glowing red crisis zone on the globe to deploy a mission
            </span>
          </div>
        )}

      </div>

      {/* Final Cinematic Reveal Overlay */}
      <AnimatePresence>
        {showFinalReveal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md text-center px-6"
          >
            <Sparkles className="w-16 h-16 text-[#00ffaa] mb-8 animate-pulse" />
            <motion.h1 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-5xl md:text-7xl font-heading font-bold text-white tracking-widest uppercase drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] glow-text mb-6"
            >
              Planet Restored
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-xl md:text-2xl text-[#0088ff] font-light max-w-2xl leading-relaxed"
            >
              You didn't just complete quests. <br />
              <span className="text-white font-medium">You saved a world.</span>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
