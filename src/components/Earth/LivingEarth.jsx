import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import EarthModel from './EarthModel';
import { useSimulation } from '../../context/SimulationContext';
import { talkToEarth } from '../../services/ai';
import { MessageCircle, Loader2, X, Globe } from 'lucide-react';

export default function LivingEarth() {
  const { healthScore, actionHistory } = useSimulation();
  const [isTalking, setIsTalking] = useState(false);
  const [earthResponse, setEarthResponse] = useState('');
  const [userQuestion, setUserQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceTimeline, setVoiceTimeline] = useState('');

  // Earth's Voice Timeline effect
  useEffect(() => {
    if (healthScore < 30) setVoiceTimeline("I am struggling to breathe. The smog is suffocating.");
    else if (healthScore < 50) setVoiceTimeline("Things are fragile, but I feel slight changes in the air.");
    else if (healthScore < 70) setVoiceTimeline("The air is getting cleaner. I can feel life returning to my forests.");
    else if (healthScore < 90) setVoiceTimeline("My oceans are cooling. The balance is restoring. Thank you.");
    else setVoiceTimeline("We are recovering. I am thriving once again. A beautiful future awaits.");
  }, [healthScore]);

  const handleTalk = async (e) => {
    if (e) e.preventDefault();
    if (!userQuestion.trim()) return;
    
    setIsTalking(true);
    setLoading(true);
    setEarthResponse('');
    
    try {
      const res = await talkToEarth(userQuestion, healthScore);
      setEarthResponse(res?.response || "I cannot hear you right now... the connection is lost.");
    } catch (error) {
      console.error(error);
      setEarthResponse("The transmission failed. My voice cannot reach you right now.");
    } finally {
      setLoading(false);
      setUserQuestion('');
    }
  };

  return (
    <div className="w-full h-full min-h-[600px] lg:h-screen relative overflow-hidden">
      {/* HUD overlay for health score */}
      <div className="absolute top-8 left-8 z-10 p-6 rounded-2xl bg-bg-surface/80 backdrop-blur-xl border border-white/10 shadow-2xl">
        <h3 className="text-text-secondary text-xs uppercase tracking-widest font-heading mb-1">Planet Health</h3>
        <div className="text-5xl font-bold text-accent-green glow-text mb-4">
          {healthScore.toFixed(0)}<span className="text-3xl text-text-primary">%</span>
        </div>
        
        {/* Earth's Voice Timeline */}
        <div className="mt-4 pt-4 border-t border-white/10 max-w-xs">
          <p className="text-sm italic text-white/80 leading-relaxed border-l-2 border-accent-teal pl-3">
            "{voiceTimeline}"
          </p>
        </div>
      </div>

      {/* Talk To Earth Floating Button */}
      <div className="absolute bottom-12 right-12 z-20">
        <button 
          onClick={() => setIsTalking(true)}
          className="flex items-center gap-3 bg-accent-teal hover:bg-[#00bfa5] text-bg-primary px-6 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(29,233,182,0.4)] transition-all hover:scale-105"
        >
          <MessageCircle /> Talk To Earth
        </button>
      </div>

      {/* Talk To Earth Overlay */}
      <AnimatePresence>
        {isTalking && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-32 right-12 z-20 w-96 bg-bg-surface/90 backdrop-blur-2xl border border-accent-teal rounded-3xl p-6 shadow-2xl"
          >
            <button onClick={() => setIsTalking(false)} className="absolute top-4 right-4 text-white/50 hover:text-white">
              <X size={20} />
            </button>
            <h4 className="font-heading font-bold text-accent-teal mb-4 flex items-center gap-2">
              <Globe size={18} /> Direct Link to Earth
            </h4>
            
            <form onSubmit={handleTalk} className="mb-4">
              <input
                type="text"
                placeholder="Ask Earth a question..."
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                disabled={loading}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent-teal"
              />
            </form>

            {loading ? (
              <div className="flex justify-center py-6"><Loader2 className="animate-spin text-accent-teal" /></div>
            ) : earthResponse ? (
              <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                <p className="text-white text-md italic leading-relaxed">
                  "{earthResponse}"
                </p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.1} />
          <directionalLight position={[5, 3, 5]} intensity={2} color="#ffffff" />
          
          {healthScore > 40 && (
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          )}

          <EarthModel />
          
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
