import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import EchoesScene from './EchoesScene';
import { getDocumentaryScript } from '../../services/ai';
import { Play, FastForward, Rewind, Clapperboard, Quote, Radio } from 'lucide-react';

const CHAPTERS = [
  { id: 0, year: 2026, title: "The Decision", key: "c1_decision" },
  { id: 1, year: 2028, title: "The First Changes", key: "c2_changes" },
  { id: 2, year: 2035, title: "The Turning Point", key: "c3_turning_point" },
  { id: 3, year: 2050, title: "A New Generation", key: "c4_new_generation" },
  { id: 4, year: 2075, title: "The Legacy", key: "c5_legacy" }
];

// Simple Typewriter component
const TypewriterText = ({ text }) => {
  const [displayed, setDisplayed] = useState("");
  
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 20); // 20ms per character
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayed}</span>;
};

export default function FutureImpactStory() {
  const [policy, setPolicy] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [script, setScript] = useState(null);
  const [chapterIdx, setChapterIdx] = useState(0);

  const activeChapter = CHAPTERS[chapterIdx];
  const isFinale = chapterIdx === 4;

  const handleStart = async (e) => {
    e.preventDefault();
    if (!policy.trim()) return;
    
    setIsLoading(true);
    try {
      const data = await getDocumentaryScript(policy);
      // Ensure we parse if it's a string
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      setScript(parsedData);
      setIsStarted(true);
      setChapterIdx(0);
    } catch (err) {
      console.error(err);
      // Fallback script if Groq fails
      setScript({
        c1_decision: "In 2026, a critical decision was made.",
        c2_changes: "By 2028, the first signs of recovery appeared.",
        c3_turning_point: "2035 marked the global turning point.",
        c4_new_generation: "In 2050, children grew up in a fundamentally different world.",
        c5_legacy: "By 2075, the Earth had healed. This is your legacy.",
        news_2030: "Global emissions drop by 15%",
        news_2040: "Cities achieve 100% renewable grid",
        news_2060: "Biodiversity reaches pre-industrial levels",
        interview_name: "Dr. Sarah Chen",
        interview_role: "Lead Climatologist",
        interview_quote: "We didn't just survive. We thrived."
      });
      setIsStarted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-[85vh] min-h-[800px] relative rounded-3xl overflow-hidden bg-black select-none shadow-2xl font-serif">
      
      {!isStarted ? (
        // Intro Screen
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-50 bg-[#050505]">
          <Clapperboard className="w-16 h-16 text-white/30 mb-8" />
          <h1 className="text-5xl md:text-7xl text-white font-light tracking-[0.2em] uppercase mb-4 text-center">Future Echoes</h1>
          <p className="text-white/50 tracking-widest text-sm uppercase mb-12">See the story your choices create</p>
          
          <form onSubmit={handleStart} className="w-full max-w-xl flex flex-col items-center">
            <input 
              type="text" 
              placeholder="Enter a climate policy (e.g., City-wide composting)" 
              value={policy}
              onChange={(e) => setPolicy(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-6 py-4 text-white text-center text-lg placeholder:text-white/30 focus:outline-none focus:border-white/50 transition-colors font-sans mb-8"
              autoFocus
            />
            <button 
              type="submit"
              disabled={isLoading || !policy.trim()}
              className="bg-white text-black px-12 py-4 rounded-full tracking-widest uppercase font-bold text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 font-sans"
            >
              {isLoading ? "Sequencing Timeline..." : <><Play size={16} /> Begin Documentary</>}
            </button>
          </form>
        </div>
      ) : (
        // Documentary Player
        <>
          {/* 3D Scene */}
          <div className="absolute inset-0 z-0">
            <Canvas>
              <React.Suspense fallback={null}>
                <EchoesScene year={activeChapter.year} isFinale={isFinale} />
              </React.Suspense>
            </Canvas>
          </div>

          {/* Letterbox Bars */}
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none"></div>

          {/* Overlay UI */}
          <div className="absolute inset-0 z-20 flex flex-col justify-between pointer-events-none">
            
            {/* Top Bar: Year & Title */}
            <div className="p-8 flex justify-between items-start">
              <div>
                <motion.div 
                  key={`year-${activeChapter.year}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-6xl text-white font-light tracking-widest drop-shadow-2xl"
                >
                  {activeChapter.year}
                </motion.div>
                <motion.div 
                  key={`title-${activeChapter.title}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-white/70 tracking-[0.3em] uppercase text-sm mt-2 font-sans"
                >
                  Chapter {chapterIdx + 1} — {activeChapter.title}
                </motion.div>
              </div>

              {/* Holographic News (Only in mid chapters) */}
              {chapterIdx === 1 && script.news_2030 && (
                <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="bg-blue-900/40 backdrop-blur-md border border-blue-400/30 p-4 rounded-xl max-w-xs font-sans pointer-events-auto">
                  <div className="text-blue-400 text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2"><Radio size={12}/> Global Broadcast</div>
                  <div className="text-white text-sm font-medium">"{script.news_2030}"</div>
                </motion.div>
              )}
              {chapterIdx === 2 && script.news_2040 && (
                <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="bg-blue-900/40 backdrop-blur-md border border-blue-400/30 p-4 rounded-xl max-w-xs font-sans pointer-events-auto">
                  <div className="text-blue-400 text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2"><Radio size={12}/> Global Broadcast</div>
                  <div className="text-white text-sm font-medium">"{script.news_2040}"</div>
                </motion.div>
              )}
            </div>

            {/* Middle: Citizen Interview (Chapter 4) */}
            <div className="flex-1 flex items-center justify-end p-12">
              <AnimatePresence>
                {chapterIdx === 3 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl max-w-md font-sans pointer-events-auto"
                  >
                    <Quote className="text-white/20 w-8 h-8 mb-4" />
                    <p className="text-white/90 text-lg leading-relaxed italic mb-6">"{script.interview_quote}"</p>
                    <div>
                      <div className="text-white font-bold">{script.interview_name}</div>
                      <div className="text-white/50 text-xs tracking-widest uppercase">{script.interview_role}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom: Subtitles & Timeline */}
            <div className="p-8 pb-4">
              
              {/* Cinematic Subtitles */}
              <div className="max-w-4xl mx-auto text-center mb-12 h-24 flex items-end justify-center">
                <p className="text-2xl md:text-3xl text-white font-light leading-relaxed drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                  <TypewriterText key={activeChapter.key} text={script[activeChapter.key]} />
                </p>
              </div>

              {/* Timeline Scrubber */}
              <div className="max-w-3xl mx-auto pointer-events-auto font-sans">
                <div className="flex justify-between items-center mb-4">
                  <button 
                    onClick={() => setChapterIdx(Math.max(0, chapterIdx - 1))}
                    disabled={chapterIdx === 0}
                    className="text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Rewind size={20} />
                  </button>
                  
                  <div className="flex-1 mx-8 relative flex items-center h-8">
                    {/* Track */}
                    <div className="absolute w-full h-[2px] bg-white/20 rounded-full"></div>
                    {/* Markers */}
                    {CHAPTERS.map((chap, idx) => (
                      <div 
                        key={chap.id}
                        onClick={() => setChapterIdx(idx)}
                        className={`absolute w-3 h-3 rounded-full cursor-pointer transition-all -mt-[1px] transform -translate-y-1/2 -translate-x-1/2
                          ${idx === chapterIdx ? 'bg-white shadow-[0_0_10px_white] scale-150 z-10' : 'bg-white/50 hover:bg-white/80'}`}
                        style={{ left: `${(idx / (CHAPTERS.length - 1)) * 100}%` }}
                      >
                        <div className={`absolute top-6 left-1/2 -translate-x-1/2 text-[10px] tracking-widest ${idx === chapterIdx ? 'text-white font-bold' : 'text-white/40'}`}>
                          {chap.year}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setChapterIdx(Math.min(CHAPTERS.length - 1, chapterIdx + 1))}
                    disabled={chapterIdx === CHAPTERS.length - 1}
                    className="text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <FastForward size={20} />
                  </button>
                </div>
              </div>

            </div>
          </div>
          
          {/* Finale Text Overlay */}
          <AnimatePresence>
            {isFinale && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 2 }}
                className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
              >
                <div className="text-center">
                  <h2 className="text-4xl text-white font-light tracking-[0.2em] uppercase mb-4 drop-shadow-2xl">Every future begins</h2>
                  <h2 className="text-4xl text-white font-light tracking-[0.2em] uppercase drop-shadow-2xl">with a single decision.</h2>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </>
      )}
    </div>
  );
}
