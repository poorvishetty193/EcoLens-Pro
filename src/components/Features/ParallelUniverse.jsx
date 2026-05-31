import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import RealityShiftScene from './RealityShiftScene';
import { HeartPulse, Wind, TreePine, Droplets, ArrowRight } from 'lucide-react';

const FUTURE_EVENTS = [
  { threshold: 20, year: 2030, text: "Air quality improves by 15%", pos: "top-20 left-10" },
  { threshold: 45, year: 2040, text: "Renewables become dominant energy source", pos: "top-1/3 right-10" },
  { threshold: 70, year: 2050, text: "Urban emissions reduced by 60%", pos: "bottom-32 left-20" }
];

export default function ParallelUniverse() {
  const [shiftProgress, setShiftProgress] = useState(0);
  const [showExplosion, setShowExplosion] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleDrag = (e) => {
    if (!containerRef.current || showExplosion || !isDragging) return;
    const bounds = containerRef.current.getBoundingClientRect();
    let x = e.clientX || (e.touches && e.touches[0].clientX);
    if (x === undefined) return;
    
    x = x - bounds.left;
    const pos = Math.max(0, Math.min(100, (x / bounds.width) * 100));
    setShiftProgress(pos);

    if (pos >= 99 && !showExplosion) {
      setShiftProgress(100);
      setShowExplosion(true);
      setIsDragging(false);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return (
    <div 
      className="w-full h-[85vh] min-h-[800px] relative rounded-3xl overflow-hidden bg-black select-none"
      ref={containerRef}
      onMouseMove={handleDrag}
      onTouchMove={handleDrag}
      onMouseLeave={() => setIsDragging(false)}
    >
      {/* 3D Engine Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
          <React.Suspense fallback={null}>
            <RealityShiftScene shiftProgress={shiftProgress} />
            <OrbitControls enableZoom={false} enablePan={false} />
          </React.Suspense>
        </Canvas>
      </div>

      {/* Dimensional Energy Beam Slider */}
      {!showExplosion && (
        <>
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-white z-20 cursor-ew-resize shadow-[0_0_20px_rgba(0,255,170,1)] group"
            style={{ left: `${shiftProgress}%` }}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-24 bg-white/10 backdrop-blur-md border border-white/50 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all shadow-[0_0_30px_rgba(0,255,170,0.5)]">
              <div className="flex gap-1">
                <div className="w-[2px] h-8 bg-accent-teal/80"></div>
                <div className="w-[2px] h-8 bg-accent-teal/80"></div>
              </div>
            </div>
          </div>
          
          {/* Instructions Overlay (Fades out when dragged) */}
          <AnimatePresence>
            {shiftProgress < 5 && (
              <motion.div 
                exit={{ opacity: 0 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none text-center"
              >
                <div className="bg-black/50 backdrop-blur-md px-8 py-4 rounded-full border border-white/10 animate-pulse">
                  <p className="text-white text-xl tracking-widest uppercase font-light">Drag Reality Beam</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Floating Event Cards */}
      <AnimatePresence>
        {!showExplosion && FUTURE_EVENTS.map((event, idx) => (
          shiftProgress >= event.threshold && (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`absolute ${event.pos} z-10 bg-black/40 backdrop-blur-xl border border-accent-teal/30 p-6 rounded-2xl shadow-[0_0_30px_rgba(0,255,170,0.1)] pointer-events-none`}
            >
              <div className="text-accent-teal font-mono text-sm mb-1">Year {event.year}</div>
              <div className="text-white font-medium text-lg">{event.text}</div>
            </motion.div>
          )
        ))}
      </AnimatePresence>

      {/* Future Citizen Mode HUD */}
      {!showExplosion && (
        <div className="absolute bottom-10 left-10 z-10 bg-black/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl pointer-events-none transition-all duration-300 w-80">
          <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
            <HeartPulse className={shiftProgress > 50 ? "text-accent-teal" : "text-accent-red"} size={24} />
            <h3 className="text-white font-heading tracking-widest uppercase text-sm">Citizen Vitals</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Life Expectancy</span>
              <span className="text-white font-mono">{Math.floor(72 + (shiftProgress / 100) * 14)} yrs</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Respiratory Health</span>
              <span className={shiftProgress > 50 ? "text-accent-teal" : "text-accent-red"}>
                {shiftProgress > 80 ? 'Optimal' : shiftProgress > 40 ? 'Stable' : 'Declining'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Energy Cost</span>
              <span className="text-white font-mono">-${Math.floor((shiftProgress / 100) * 450)}/yr</span>
            </div>
          </div>
        </div>
      )}

      {/* Cinematic Explosion & Legacy Reveal */}
      <AnimatePresence>
        {showExplosion && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          >
            {/* Explosion Particles */}
            <motion.div 
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute w-64 h-64 bg-accent-teal rounded-full blur-[100px]"
            />

            <div className="relative z-10 text-center max-w-4xl px-8">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
                className="text-5xl md:text-7xl font-heading font-bold text-white mb-16 tracking-widest uppercase glow-text"
              >
                Which future do you choose?
              </motion.h1>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }}>
                  <Wind className="mx-auto text-accent-teal mb-4" size={40} />
                  <div className="text-4xl font-bold text-white mb-2">+67%</div>
                  <div className="text-white/60 text-sm uppercase tracking-widest">Cleaner Air</div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }}>
                  <TreePine className="mx-auto text-accent-green mb-4" size={40} />
                  <div className="text-4xl font-bold text-white mb-2">+54%</div>
                  <div className="text-white/60 text-sm uppercase tracking-widest">Forest Cover</div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.4 }}>
                  <Droplets className="mx-auto text-accent-blue mb-4" size={40} />
                  <div className="text-4xl font-bold text-white mb-2">-72%</div>
                  <div className="text-white/60 text-sm uppercase tracking-widest">Carbon Emissions</div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.6 }}>
                  <HeartPulse className="mx-auto text-accent-red mb-4" size={40} />
                  <div className="text-4xl font-bold text-white mb-2">300M</div>
                  <div className="text-white/60 text-sm uppercase tracking-widest">Lives Saved</div>
                </motion.div>
              </div>

              <motion.button 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4 }}
                onClick={() => {
                  setShowExplosion(false);
                  setShiftProgress(0);
                }}
                className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform inline-flex items-center gap-2"
              >
                Restart Simulation <ArrowRight size={20} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
