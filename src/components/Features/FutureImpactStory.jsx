import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImpactStory } from '../../services/ai';
import { Loader2, Clapperboard, ChevronRight, ChevronLeft } from 'lucide-react';

export default function FutureImpactStory() {
  const [actions, setActions] = useState('');
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const generateStory = async () => {
    if (!actions) return;
    setLoading(true);
    try {
      const results = await getImpactStory(actions);
      setStory(results);
      setCurrentIndex(0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    if (story && currentIndex < story.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 p-6">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-heading font-bold text-text-primary mb-4 glow-text">Your Future Impact Story</h2>
        <p className="text-text-secondary text-lg">Generate a cinematic documentary of your city's future based on your policies.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <input 
          type="text" 
          className="flex-1 bg-bg-surface/50 border border-border-subtle rounded-xl px-6 py-4 text-text-primary focus:outline-none focus:border-accent-teal transition-colors"
          placeholder="e.g. Implement city-wide composting and vertical farming"
          value={actions}
          onChange={(e) => setActions(e.target.value)}
        />
        <button 
          onClick={generateStory}
          disabled={loading || !actions}
          className="bg-accent-teal hover:bg-[#00bfa5] text-bg-primary font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><Clapperboard /> Generate Story</>}
        </button>
      </div>

      {story && story.length > 0 && (
        <div className="relative w-full h-[400px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-gradient-to-br from-[#0a1a10] to-bg-primary border border-accent-teal rounded-3xl p-12 flex flex-col justify-center items-center text-center shadow-[0_0_40px_rgba(29,233,182,0.15)]"
            >
              <h3 className="text-5xl font-heading font-bold text-accent-teal mb-8">
                Year {story[currentIndex].year}
              </h3>
              <p className="text-2xl text-text-primary leading-relaxed max-w-2xl font-light italic">
                "{story[currentIndex].narrative}"
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-8 w-full flex justify-between px-12 z-10">
            <button 
              onClick={prevCard} 
              disabled={currentIndex === 0}
              className="w-12 h-12 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center text-white disabled:opacity-30 transition-all hover:border-accent-teal hover:text-accent-teal"
            >
              <ChevronLeft />
            </button>
            <div className="flex gap-2 items-center">
              {story.map((_, idx) => (
                <div key={idx} className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex ? 'bg-accent-teal w-8' : 'bg-border-subtle'}`} />
              ))}
            </div>
            <button 
              onClick={nextCard} 
              disabled={currentIndex === story.length - 1}
              className="w-12 h-12 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center text-white disabled:opacity-30 transition-all hover:border-accent-teal hover:text-accent-teal"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
