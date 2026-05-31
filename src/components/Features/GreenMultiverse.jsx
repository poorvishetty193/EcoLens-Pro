import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import MultiverseScene from './MultiverseScene';
import { getClimateNews, getCitizenStory, getLegacyNarrative } from '../../services/ai';
import { Globe, Wind, Droplet, Zap, ArrowLeft, Swords, Play } from 'lucide-react';

const TIMELINES = [
  {
    id: 'A',
    name: 'Business as Usual',
    color: 'from-accent-red to-[#4a0000]',
    borderColor: 'border-accent-red',
    textColor: 'text-accent-red',
    desc: 'Current trajectory with no major policy shifts.'
  },
  {
    id: 'B',
    name: 'Renewable Transition',
    color: 'from-accent-amber to-[#4a3500]',
    borderColor: 'border-accent-amber',
    textColor: 'text-accent-amber',
    desc: 'Steady adoption of solar and wind energy over 20 years.'
  },
  {
    id: 'C',
    name: 'Aggressive Action',
    color: 'from-accent-green to-[#004a26]',
    borderColor: 'border-accent-green',
    textColor: 'text-accent-green',
    desc: 'Global coordinated effort to halt emissions.'
  },
  {
    id: 'D',
    name: 'Tech Breakthrough',
    color: 'from-accent-teal to-[#004a4a]',
    borderColor: 'border-accent-teal',
    textColor: 'text-accent-teal',
    desc: 'Fusion energy and massive carbon capture deployment.'
  }
];

export default function GreenMultiverse() {
  const [viewMode, setViewMode] = useState('cosmos'); // cosmos, universe, comparison, collision, legacy
  const [activeUniverse, setActiveUniverse] = useState(null);
  const [compareUniverse, setCompareUniverse] = useState(null);
  const [timelineYear, setTimelineYear] = useState(2026);
  
  // AI States
  const [news, setNews] = useState([]);
  const [citizenStory, setCitizenStory] = useState([]);
  const [legacyText, setLegacyText] = useState("");

  const handleEnterUniverse = async (universe) => {
    setActiveUniverse(universe);
    setViewMode('universe');
    setTimelineYear(2026);
    
    // Fetch AI data
    getClimateNews(universe.name).then(setNews);
    getCitizenStory(universe.name).then(setCitizenStory);
  };

  const handleCollision = async (uni1, uni2) => {
    setActiveUniverse(uni1);
    setCompareUniverse(uni2);
    setViewMode('collision');
    
    const narrative = await getLegacyNarrative(uni1.name, uni2.name);
    
    setTimeout(() => {
      setLegacyText(narrative.narrative);
      setViewMode('legacy');
    }, 4000); // Wait for collision animation
  };

  // Generate dynamic stats based on year
  const getDynamicStats = () => {
    if (!activeUniverse) return null;
    const progress = (timelineYear - 2026) / 74; // 0 to 1
    
    if (activeUniverse.id === 'A') {
      return { score: Math.max(0, 32 - progress * 32), air: 'Critical', water: 'Toxic', carbon: '+40%' };
    }
    if (activeUniverse.id === 'C') {
      return { score: Math.min(100, 60 + progress * 40), air: 'Pure', water: 'Restored', carbon: 'Net Zero' };
    }
    return { score: 68, air: 'Fair', water: 'Stable', carbon: 'Moderate' }; // Default fallback
  };

  const stats = getDynamicStats();

  return (
    <div className="w-full h-[90vh] min-h-[800px] relative rounded-3xl overflow-hidden glass-panel border border-border-subtle shadow-2xl bg-[#030712] flex flex-col">
      {/* 3D Engine Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 5, 20], fov: 50 }}>
          <React.Suspense fallback={null}>
            <MultiverseScene 
              viewMode={viewMode}
              activeUniverse={activeUniverse}
              compareUniverse={compareUniverse}
              timelineYear={timelineYear}
            />
          </React.Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-8">
        
        {/* Cosmos Mode */}
        {viewMode === 'cosmos' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full items-center justify-between pointer-events-auto">
            <div className="text-center mt-12">
              <h2 className="text-6xl font-heading font-bold text-white mb-4 tracking-widest glow-text">THE MULTIVERSE</h2>
              <p className="text-accent-teal text-2xl uppercase tracking-widest">Select a reality portal to enter</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl mb-12">
              {TIMELINES.map(t => (
                <button 
                  key={t.id}
                  onClick={() => handleEnterUniverse(t)}
                  className={`p-6 rounded-2xl bg-black/40 backdrop-blur-md border ${t.borderColor} hover:bg-white/10 transition-all group`}
                >
                  <h3 className={`text-2xl font-bold ${t.textColor} mb-2`}>Universe {t.id}</h3>
                  <p className="text-white font-medium">{t.name}</p>
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => setViewMode('comparison')}
              className="px-8 py-4 bg-accent-purple text-white font-bold rounded-full mb-8 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(124,77,255,0.5)]"
            >
              Enter Comparison Chamber
            </button>
          </motion.div>
        )}

        {/* Universe Mode */}
        <AnimatePresence>
          {viewMode === 'universe' && activeUniverse && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full pointer-events-auto">
              {/* Header */}
              <div className="flex justify-between items-start">
                <button onClick={() => setViewMode('cosmos')} className="bg-black/50 p-4 rounded-xl border border-white/20 text-white hover:bg-white/10 flex items-center gap-2 backdrop-blur-md">
                  <ArrowLeft size={20} /> Back to Cosmos
                </button>
                <div className="text-right bg-black/50 p-6 rounded-2xl border border-white/20 backdrop-blur-md">
                  <h2 className={`text-3xl font-heading font-bold ${activeUniverse.textColor}`}>Universe {activeUniverse.id}</h2>
                  <p className="text-white text-xl">{activeUniverse.name}</p>
                </div>
              </div>

              <div className="flex justify-between items-end mt-auto gap-8">
                {/* Holographic Stats */}
                <div className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 min-w-[250px]">
                  <div className="flex justify-between items-center"><span className="text-white/60">Planet Score</span><span className={`text-2xl font-bold ${activeUniverse.textColor}`}>{Math.floor(stats.score)}/100</span></div>
                  <div className="flex justify-between items-center"><span className="text-white/60">Air Quality</span><span className="text-white font-bold">{stats.air}</span></div>
                  <div className="flex justify-between items-center"><span className="text-white/60">Water Health</span><span className="text-white font-bold">{stats.water}</span></div>
                  <div className="flex justify-between items-center"><span className="text-white/60">Carbon Levels</span><span className="text-white font-bold">{stats.carbon}</span></div>
                </div>

                {/* Timeline Slider */}
                <div className="flex-1 bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
                  <h3 className="text-white font-bold mb-6 text-center tracking-widest uppercase text-xl">Timeline: {timelineYear}</h3>
                  <input 
                    type="range" min="2026" max="2100" step="1"
                    value={timelineYear}
                    onChange={(e) => setTimelineYear(parseInt(e.target.value))}
                    className="w-full appearance-none bg-white/10 h-3 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
                  />
                  <div className="flex justify-between text-white/50 mt-4 font-mono font-bold">
                    <span>2026</span><span>2050</span><span>2075</span><span>2100</span>
                  </div>
                </div>

                {/* Citizen Story Box */}
                <div className="w-[350px] bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl p-6 h-[250px] overflow-y-auto custom-scrollbar">
                  <h3 className="text-accent-teal font-bold mb-4 uppercase tracking-widest text-sm flex items-center gap-2">Citizen Lifeline</h3>
                  {(Array.isArray(citizenStory) ? citizenStory : []).map((s, i) => (
                    timelineYear >= s.year && (
                      <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mb-4 pb-4 border-b border-white/10 last:border-0">
                        <div className="text-white/50 text-xs font-mono mb-1">Year {s.year} (Age {s.age})</div>
                        <div className="text-white text-sm">{s.narrative}</div>
                      </motion.div>
                    )
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comparison Chamber */}
        {viewMode === 'comparison' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full justify-between items-center pointer-events-auto">
             <button onClick={() => setViewMode('cosmos')} className="absolute top-8 left-8 bg-black/50 p-4 rounded-xl border border-white/20 text-white hover:bg-white/10 flex items-center gap-2 backdrop-blur-md">
                <ArrowLeft size={20} /> Exit Chamber
              </button>
            <h2 className="text-5xl font-heading font-bold text-white mt-8 tracking-widest glow-text">COMPARISON ARENA</h2>
            
            <div className="bg-black/60 backdrop-blur-xl border border-white/20 p-8 rounded-3xl max-w-3xl text-center mb-12 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
              <h3 className="text-2xl text-white mb-6 uppercase tracking-widest font-bold">Trigger Multiverse Collision</h3>
              <p className="text-white/70 mb-8">Select two timelines to collide and witness the extreme divergence in their destinies.</p>
              
              <div className="flex justify-center gap-4">
                <button onClick={() => handleCollision(TIMELINES[0], TIMELINES[2])} className="px-6 py-4 bg-accent-red hover:bg-red-500 text-white font-bold rounded-xl flex items-center gap-3">
                  Universe A <Swords size={20}/> Universe C
                </button>
                <button onClick={() => handleCollision(TIMELINES[0], TIMELINES[3])} className="px-6 py-4 bg-accent-teal hover:bg-teal-500 text-white font-bold rounded-xl flex items-center gap-3">
                  Universe A <Swords size={20}/> Universe D
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Legacy Screen */}
        {viewMode === 'legacy' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1.5 }}
            className="flex flex-col h-full items-center justify-center pointer-events-auto bg-black/90 absolute inset-0 z-50 p-8 md:p-12 text-center overflow-y-auto custom-scrollbar"
          >
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-8 tracking-widest uppercase drop-shadow-2xl">
              Which future will you leave behind?
            </h1>
            <p className="text-lg md:text-2xl text-accent-teal font-light max-w-4xl leading-relaxed mb-12 glow-text">
              "{legacyText}"
            </p>
            <button onClick={() => setViewMode('cosmos')} className="px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:scale-105 transition-transform flex items-center gap-3 shrink-0">
              <Play fill="black" /> Return to Cosmos
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
}
