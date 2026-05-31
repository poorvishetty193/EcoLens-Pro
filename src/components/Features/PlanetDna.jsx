import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import DnaScene from './DnaScene';
import { getPlanetDna } from '../../services/ai';
import { Dna, Fingerprint, Shield, Sparkles, Hexagon, History } from 'lucide-react';

const TIMELINES = [
  'Business As Usual',
  'Sustainable',
  'Innovation',
  'Climate Leader'
];

export default function PlanetDna() {
  const [activeTimeline, setActiveTimeline] = useState('Sustainable');
  const [isExtracting, setIsExtracting] = useState(false);
  const [dnaResult, setDnaResult] = useState(null);

  const fetchDna = async (timeline) => {
    setIsExtracting(true);
    setDnaResult(null);
    
    try {
      // Add artificial extraction delay for cinematic effect
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = await getPlanetDna(timeline);
      
      // Parse if string, otherwise use object
      let parsed = typeof result === 'string' ? JSON.parse(result) : result;
      setDnaResult(parsed);
    } catch (error) {
      console.error(error);
      setDnaResult({
        archetype: "Unknown Entity",
        creature: "Shadow Construct",
        story: "The timeline collapsed before your DNA could be sequenced.",
        legacy: "Unknown Future"
      });
    } finally {
      setIsExtracting(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchDna(activeTimeline);
  }, [activeTimeline]);

  return (
    <div className="w-full h-[85vh] min-h-[800px] relative rounded-3xl overflow-hidden bg-[#050510] select-none border border-white/10 shadow-2xl">
      
      {/* 3D Engine Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
          <React.Suspense fallback={null}>
            <DnaScene timeline={activeTimeline} isExtracting={isExtracting} />
            <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />
          </React.Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none p-8 flex flex-col justify-between">
        
        {/* Top: Multiverse Selector */}
        <div className="flex justify-between items-start pointer-events-auto">
          <div className="bg-black/40 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
            <h1 className="text-white font-heading font-bold text-2xl tracking-widest uppercase flex items-center gap-3">
              <Dna className="text-accent-teal" /> Planet DNA Lab
            </h1>
            <p className="text-white/50 text-xs tracking-widest uppercase mt-1">Discover your environmental legacy</p>
          </div>

          <div className="flex gap-2">
            {TIMELINES.map(t => (
              <button 
                key={t}
                onClick={() => { if (!isExtracting) setActiveTimeline(t); }}
                className={`px-4 py-2 rounded-xl border text-xs font-bold tracking-widest uppercase transition-all
                  ${activeTimeline === t 
                    ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]' 
                    : 'bg-black/50 text-white/50 border-white/10 hover:border-white/30'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Extraction Cinematic */}
        <AnimatePresence>
          {isExtracting && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none"
            >
              <Fingerprint className="w-24 h-24 text-accent-teal mb-8 animate-pulse" />
              <div className="text-white font-mono text-xl tracking-[0.3em] uppercase bg-black/60 px-8 py-3 rounded-full backdrop-blur-md border border-accent-teal/30">
                Sequencing DNA...
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom / Sides: DNA Results */}
        <AnimatePresence>
          {dnaResult && !isExtracting && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-12 gap-6 w-full"
            >
              {/* Left Column: Archetype & Creature */}
              <div className="col-span-3 space-y-6">
                <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 pointer-events-auto">
                  <div className="text-accent-teal text-xs tracking-widest uppercase mb-4 flex items-center gap-2">
                    <Shield size={14} /> Environmental Archetype
                  </div>
                  <h2 className="text-4xl font-heading font-bold text-white mb-2 leading-tight">{dnaResult.archetype}</h2>
                  <div className="bg-white/10 inline-block px-3 py-1 rounded-md text-xs font-mono text-white/70">
                    ID: {Math.random().toString(36).substring(7).toUpperCase()}
                  </div>
                </div>

                <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 pointer-events-auto">
                  <div className="text-accent-purple text-xs tracking-widest uppercase mb-2 flex items-center gap-2">
                    <Hexagon size={14} /> Spirit Creature
                  </div>
                  <div className="text-2xl font-bold text-white">{dnaResult.creature}</div>
                </div>
              </div>

              {/* Center Spacer */}
              <div className="col-span-5" />

              {/* Right Column: Legacy & Story */}
              <div className="col-span-4 space-y-6 flex flex-col justify-end">
                <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 pointer-events-auto max-h-[200px] overflow-y-auto custom-scrollbar">
                  <div className="text-accent-orange text-xs tracking-widest uppercase mb-4 flex items-center gap-2">
                    <History size={14} /> Future Legacy Projection
                  </div>
                  <div className="text-base font-medium text-white/90 leading-relaxed">
                    {dnaResult.legacy}
                  </div>
                </div>

                <div className="bg-black/60 backdrop-blur-2xl p-6 rounded-2xl border border-accent-teal/20 pointer-events-auto shadow-[0_0_30px_rgba(0,255,170,0.1)] max-h-[350px] overflow-y-auto custom-scrollbar">
                  <div className="text-accent-teal text-xs tracking-widest uppercase mb-4 flex items-center gap-2">
                    <Sparkles size={14} /> Origin Story
                  </div>
                  <div className="text-white/80 font-serif italic text-base leading-relaxed">
                    "{dnaResult.story}"
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
