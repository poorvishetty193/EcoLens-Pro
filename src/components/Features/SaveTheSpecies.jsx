import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '../../context/SimulationContext';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import RewildingScene from './RewildingScene';
import { getSpeciesRecoveryStory } from '../../services/ai';
import { ShieldCheck, Target, HeartPulse, Sparkles, X, Sun, Snowflake, Leaf, TreeDeciduous } from 'lucide-react';

const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];
const SEASON_ICONS = { Spring: Leaf, Summer: Sun, Autumn: TreeDeciduous, Winter: Snowflake };

const SPECIES_DB = [
  { id: 'insects', name: 'Meadow Insects', unlockScore: 30, basePop: 15000 },
  { id: 'butterfly', name: 'Monarch Butterfly', unlockScore: 50, basePop: 2400 },
  { id: 'turtle', name: 'Sea Turtle', unlockScore: 70, basePop: 120 },
  { id: 'eagle', name: 'Golden Eagle', unlockScore: 85, basePop: 45 },
  { id: 'snow_leopard', name: 'Snow Leopard', unlockScore: 95, basePop: 12 } // Rare!
];

export default function SaveTheSpecies() {
  const { healthScore, updateHealth } = useSimulation();
  const [seasonIndex, setSeasonIndex] = useState(0);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [story, setStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [latestDiscovery, setLatestDiscovery] = useState(null);

  const currentSeason = SEASONS[seasonIndex];
  const SeasonIcon = SEASON_ICONS[currentSeason];

  // Auto-rotate seasons
  useEffect(() => {
    const interval = setInterval(() => {
      setSeasonIndex(prev => (prev + 1) % SEASONS.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Track latest discovery for cinematic light
  useEffect(() => {
    const unlocked = SPECIES_DB.filter(s => healthScore >= s.unlockScore);
    if (unlocked.length > 0) {
      const highest = unlocked[unlocked.length - 1];
      if (latestDiscovery?.id !== highest.id) {
        setLatestDiscovery(highest);
      }
    }
  }, [healthScore, latestDiscovery]);

  const handleSpeciesClick = async (species) => {
    setSelectedSpecies(species);
    setStory('');
    setIsLoading(true);
    try {
      const result = await getSpeciesRecoveryStory(species.name);
      setStory(result.story);
    } catch (err) {
      setStory("The AI is currently observing the wildlife. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const unlockedSpecies = SPECIES_DB.filter(s => healthScore >= s.unlockScore);

  return (
    <div className="w-full h-[85vh] min-h-[800px] relative rounded-3xl overflow-hidden bg-black select-none border border-white/10 shadow-2xl">
      
      {/* 3D Engine Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 8, 25], fov: 45 }}>
          <React.Suspense fallback={null}>
            <RewildingScene healthScore={healthScore} season={currentSeason} latestDiscovery={latestDiscovery} />
            <OrbitControls enableZoom={true} minDistance={10} maxDistance={40} maxPolarAngle={Math.PI/2 - 0.1} autoRotate autoRotateSpeed={0.5} />
          </React.Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6">
        
        {/* Top Bar: Orb & Season */}
        <div className="flex justify-between items-start">
          {/* Ecosystem Health Orb */}
          <div className="flex items-center gap-4 bg-black/50 backdrop-blur-md p-4 rounded-full border border-white/10 pointer-events-auto">
            <div className="relative w-12 h-12 flex items-center justify-center">
              {/* Glowing Orb */}
              <div 
                className="absolute inset-0 rounded-full blur-md transition-all duration-1000"
                style={{ 
                  backgroundColor: healthScore > 70 ? '#00ffaa' : healthScore > 40 ? '#fbbf24' : '#ef4444',
                  opacity: (healthScore / 100) * 0.8 + 0.2
                }}
              />
              <div 
                className="relative z-10 w-8 h-8 rounded-full border-2 border-white/50 flex items-center justify-center bg-black/50"
              >
                <HeartPulse size={16} className={healthScore > 70 ? "text-accent-teal" : "text-accent-red"} />
              </div>
            </div>
            <div>
              <div className="text-white/60 text-xs uppercase tracking-widest font-mono">Life Orb</div>
              <div className="text-white font-bold text-xl">{healthScore.toFixed(0)}% <span className="text-sm font-light text-white/50">Vitality</span></div>
            </div>
          </div>

          {/* Season Indicator */}
          <div className="bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 flex items-center gap-3">
            <SeasonIcon size={20} className="text-accent-teal" />
            <span className="text-white font-heading tracking-widest uppercase">{currentSeason}</span>
          </div>
        </div>

        {/* Dynamic Populations Overlay */}
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-3 pointer-events-auto">
            <h3 className="text-accent-teal text-xs tracking-widest uppercase mb-2">Living Populations</h3>
            {SPECIES_DB.map(s => {
              const isUnlocked = healthScore >= s.unlockScore;
              const pop = isUnlocked ? Math.floor(s.basePop * (healthScore / 100)) : 0;
              
              return (
                <button 
                  key={s.id}
                  onClick={() => isUnlocked && handleSpeciesClick(s)}
                  className={`flex items-center justify-between w-64 p-3 rounded-xl border backdrop-blur-md transition-all text-left
                    ${isUnlocked ? 'bg-black/60 border-accent-teal/30 hover:bg-accent-teal/10 hover:scale-105' : 'bg-black/20 border-white/5 opacity-50 cursor-not-allowed'}
                  `}
                >
                  <span className="text-white font-medium text-sm">{s.name}</span>
                  <span className={`font-mono text-xs ${isUnlocked ? 'text-accent-teal' : 'text-white/30'}`}>
                    {isUnlocked ? pop.toLocaleString() : 'EXTINCT'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Test Controls (For demonstration) */}
          <div className="bg-black/50 backdrop-blur-md p-4 rounded-2xl border border-white/10 pointer-events-auto flex gap-4">
            <button onClick={() => updateHealth(-20)} className="text-xs text-white/50 hover:text-accent-red font-bold">Hurt Planet</button>
            <button onClick={() => updateHealth(20)} className="text-xs text-white/50 hover:text-accent-teal font-bold">Heal Planet</button>
          </div>
        </div>
      </div>

      {/* Species Discovery Profile Sidebar */}
      <AnimatePresence>
        {selectedSpecies && (
          <motion.div 
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="absolute top-0 right-0 bottom-0 w-96 bg-black/80 backdrop-blur-2xl border-l border-white/10 z-50 p-8 flex flex-col pointer-events-auto"
          >
            <button onClick={() => setSelectedSpecies(null)} className="absolute top-6 right-6 text-white/50 hover:text-white">
              <X size={24} />
            </button>
            
            <div className="text-accent-teal text-xs tracking-widest uppercase mb-4 flex items-center gap-2">
              <Sparkles size={14} /> Species Recovery
            </div>
            
            <h2 className="text-3xl font-heading font-bold text-white mb-2">{selectedSpecies.name}</h2>
            
            <div className="bg-accent-teal/10 border border-accent-teal/30 px-4 py-2 rounded-lg inline-block mb-8 self-start">
              <span className="text-accent-teal font-bold text-sm tracking-wide">Status: THRIVING</span>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <div className="text-white/40 text-xs uppercase tracking-widest mb-1">Current Population</div>
                <div className="text-3xl font-mono text-white">
                  {Math.floor(selectedSpecies.basePop * (healthScore / 100)).toLocaleString()}
                </div>
              </div>
              
              <div>
                <div className="text-white/40 text-xs uppercase tracking-widest mb-3">AI Nature Narrative</div>
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10 text-white/90 leading-relaxed text-sm">
                  {isLoading ? (
                    <span className="animate-pulse">The AI is generating the recovery narrative...</span>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{story}</motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final Rewilding Cinematic Text */}
      <AnimatePresence>
        {healthScore >= 95 && !selectedSpecies && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center text-center px-4"
          >
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-white tracking-widest uppercase drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] glow-text mix-blend-overlay">
              Life Returns
            </h1>
            <p className="text-xl md:text-2xl text-accent-teal mt-4 font-light drop-shadow-lg bg-black/20 px-6 py-2 rounded-full backdrop-blur-sm">
              When humanity chooses differently.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
