import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import CouncilScene from './CouncilScene';
import { getDebateResponse } from '../../services/ai';
import { Gavel, ShieldAlert, Fingerprint, Activity, BarChart, Globe } from 'lucide-react';

// Typewriter component for dramatic text delivery
const TypewriterText = ({ text, speed = 30 }) => {
  const [displayed, setDisplayed] = useState("");
  
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayed}</span>;
};

export default function AiDebateChamber() {
  const [proposal, setProposal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [script, setScript] = useState(null);
  
  // Playback state: 'input', 'debating', 'voting', 'resolution'
  const [stage, setStage] = useState('input');
  const [turnIdx, setTurnIdx] = useState(0);

  const handleStart = async (e) => {
    e.preventDefault();
    if (!proposal.trim()) return;
    
    setIsLoading(true);
    try {
      const data = await getDebateResponse(proposal);
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      setScript(parsedData);
      setStage('debating');
      setTurnIdx(0);
    } catch (err) {
      console.error(err);
      // Fallback script if Groq fails or rate limits
      setScript({
        turns: [
          { speaker: "Scientist", quote: "The data is clear. We must implement this immediately to prevent critical warming thresholds.", theme: "science", confidence: 95, evidence: "High", risk: "Low" },
          { speaker: "Economist", quote: "But the short-term capital expenditure will shatter municipal budgets. We need a phased approach.", theme: "economy", confidence: 88, evidence: "Medium", risk: "High" },
          { speaker: "Scientist", isInterruption: true, quote: "You cannot put a price tag on planetary survival!", theme: "science", confidence: 99, evidence: "Absolute", risk: "Critical" },
          { speaker: "Strategist", quote: "If we phase the subsidies over 5 years, we can secure the political capital needed.", theme: "policy", confidence: 72, evidence: "Medium", risk: "Low" }
        ],
        vote: { result: "APPROVED", supportPercentage: 78 },
        resolution: "The Climate Council officially mandates the proposal with a 5-year phased economic subsidy buffer to ensure municipal compliance."
      });
      setStage('debating');
      setTurnIdx(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Playback engine
  useEffect(() => {
    if (stage === 'debating' && script) {
      if (turnIdx < script.turns.length) {
        // Read time based on text length, minimum 5 seconds
        const currentTurn = script.turns[turnIdx];
        const duration = Math.max(5000, currentTurn.quote.length * 50);
        
        const timer = setTimeout(() => {
          setTurnIdx(prev => prev + 1);
        }, duration);
        return () => clearTimeout(timer);
      } else {
        // Transition to voting
        setStage('voting');
      }
    } else if (stage === 'voting') {
      const timer = setTimeout(() => {
        setStage('resolution');
      }, 4000); // 4 seconds of voting suspense
      return () => clearTimeout(timer);
    }
  }, [stage, turnIdx, script]);

  const activeTurn = stage === 'debating' ? script?.turns[turnIdx] : null;

  return (
    <div className="w-full h-[85vh] min-h-[800px] relative rounded-3xl overflow-hidden bg-black select-none shadow-2xl font-sans">
      
      {stage === 'input' ? (
        // Input Screen
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-50 bg-[#050508]">
          <Gavel className="w-16 h-16 text-[#cc00ff] mb-8" />
          <h1 className="text-5xl font-light tracking-[0.2em] uppercase text-white mb-4 text-center">The Climate Council</h1>
          <p className="text-white/50 tracking-widest text-sm uppercase mb-12">Submit your proposal to the global simulation</p>
          
          <form onSubmit={handleStart} className="w-full max-w-2xl flex flex-col items-center">
            <input 
              type="text" 
              placeholder="e.g., Ban all petrol vehicles by 2040" 
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-8 py-5 text-white text-center text-lg placeholder:text-white/30 focus:outline-none focus:border-[#cc00ff] transition-colors mb-8"
              autoFocus
            />
            <button 
              type="submit"
              disabled={isLoading || !proposal.trim()}
              className="bg-[#cc00ff] hover:bg-[#ff00ff] text-white px-12 py-4 rounded-xl tracking-widest uppercase font-bold text-sm transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(204,0,255,0.4)]"
            >
              {isLoading ? "Summoning Council Members..." : "Convene Council"}
            </button>
          </form>
        </div>
      ) : (
        // Debate Player
        <>
          {/* 3D Scene */}
          <div className="absolute inset-0 z-0">
            <Canvas>
              <React.Suspense fallback={null}>
                <CouncilScene 
                  activeTheme={activeTurn?.theme} 
                  isInterruption={activeTurn?.isInterruption}
                  isVoting={stage === 'voting'}
                  isResolution={stage === 'resolution'}
                />
              </React.Suspense>
            </Canvas>
          </div>

          {/* Letterbox Overlays */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black via-black/90 to-transparent z-10 pointer-events-none"></div>

          <AnimatePresence mode="wait">
            {/* STAGE: DEBATING */}
            {stage === 'debating' && activeTurn && (
              <motion.div 
                key={turnIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-8"
              >
                {/* Interruption Flash Overlay */}
                {activeTurn.isInterruption && (
                  <motion.div 
                    initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1 }}
                    className="absolute inset-0 bg-red-500/20 z-0"
                  />
                )}

                {/* Top UI: Fact Check HUD */}
                <div className="flex justify-between items-start z-10">
                  <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-xl flex gap-6">
                    <div>
                      <div className="text-white/40 text-[10px] uppercase tracking-widest flex items-center gap-1 mb-1"><Activity size={10}/> Confidence</div>
                      <div className="text-xl font-mono font-bold text-white">{activeTurn.confidence}%</div>
                    </div>
                    <div>
                      <div className="text-white/40 text-[10px] uppercase tracking-widest flex items-center gap-1 mb-1"><Fingerprint size={10}/> Evidence</div>
                      <div className="text-sm font-bold text-white uppercase mt-1">{activeTurn.evidence}</div>
                    </div>
                    <div>
                      <div className="text-white/40 text-[10px] uppercase tracking-widest flex items-center gap-1 mb-1"><ShieldAlert size={10}/> Risk</div>
                      <div className={`text-sm font-bold uppercase mt-1 ${activeTurn.risk === 'High' || activeTurn.risk === 'Critical' ? 'text-red-400' : 'text-[#00ffaa]'}`}>{activeTurn.risk}</div>
                    </div>
                  </div>
                  
                  {activeTurn.isInterruption && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      className="bg-red-600 text-white font-bold tracking-widest uppercase px-4 py-2 rounded border border-red-400 animate-pulse"
                    >
                      Objection
                    </motion.div>
                  )}
                </div>

                {/* Bottom UI: Subtitles & Speaker */}
                <div className="max-w-4xl mx-auto w-full text-center pb-8 z-10">
                  <div className="text-[#cc00ff] text-sm font-bold tracking-[0.3em] uppercase mb-4 drop-shadow-lg flex justify-center items-center gap-4">
                    <span className="w-8 h-[1px] bg-[#cc00ff]"></span>
                    {activeTurn.speaker}
                    <span className="w-8 h-[1px] bg-[#cc00ff]"></span>
                  </div>
                  <p className={`text-2xl md:text-4xl font-light leading-relaxed drop-shadow-[0_4px_4px_rgba(0,0,0,1)] ${activeTurn.isInterruption ? 'text-red-100 font-medium italic' : 'text-white'}`}>
                    "<TypewriterText text={activeTurn.quote} speed={25} />"
                  </p>
                </div>
              </motion.div>
            )}

            {/* STAGE: VOTING */}
            {stage === 'voting' && (
              <motion.div 
                key="voting"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
              >
                <BarChart className="w-16 h-16 text-white/50 mb-8 animate-pulse" />
                <h2 className="text-4xl text-white font-light tracking-[0.3em] uppercase mb-4">Council is Voting</h2>
                <p className="text-white/50 tracking-widest text-sm uppercase">Calculating reality divergence...</p>
              </motion.div>
            )}

            {/* STAGE: RESOLUTION */}
            {stage === 'resolution' && (
              <motion.div 
                key="resolution"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}
                className="absolute inset-0 z-30 flex items-center justify-center p-8 pointer-events-auto"
              >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>
                
                <div className="z-10 bg-black/80 border border-[#00ffff]/30 p-12 rounded-3xl max-w-4xl text-center shadow-[0_0_50px_rgba(0,255,255,0.2)]">
                  <Globe className="w-16 h-16 text-[#00ffff] mx-auto mb-6" />
                  
                  <div className="text-[#00ffff] text-sm tracking-[0.3em] uppercase mb-4">Official Council Resolution</div>
                  
                  <div className="mb-12">
                    <span className={`text-6xl font-black tracking-widest uppercase ${script.vote.result === 'APPROVED' ? 'text-[#00ffaa]' : 'text-red-500'}`}>
                      {script.vote.result}
                    </span>
                    <div className="text-white/50 text-xs tracking-widest uppercase mt-2">With {script.vote.supportPercentage}% Council Support</div>
                  </div>

                  <p className="text-2xl text-white font-serif leading-relaxed italic mb-12">
                    "{script.resolution}"
                  </p>

                  <button 
                    onClick={() => { setStage('input'); setScript(null); setProposal(''); }}
                    className="text-white/50 hover:text-[#00ffff] tracking-widest text-xs uppercase border-b border-white/20 pb-1 transition-colors"
                  >
                    Adjourn Council
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
