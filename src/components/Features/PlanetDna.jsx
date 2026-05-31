import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { getPlanetDna } from '../../services/ai';
import { Loader2, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PlanetDna() {
  const { planetDna, setPlanetDna } = useSimulation();
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');

  const generateDNA = async () => {
    setLoading(true);
    try {
      // Simulate reading user's recent simulation choices
      const recentChoices = "Prioritizes renewable energy, supports public transport expansion, prefers plant-based diets, advocates for circular economy.";
      const res = await getPlanetDna(recentChoices);
      setPlanetDna(res.personality);
      setDescription(res.description);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-12 p-8 glass-panel rounded-3xl text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 p-32 bg-accent-purple/10 rounded-full blur-3xl -z-10"></div>
      
      <Fingerprint className="w-16 h-16 text-accent-purple mx-auto mb-6" />
      <h2 className="text-4xl font-heading font-bold text-text-primary mb-2">Planet DNA</h2>
      <p className="text-text-secondary text-lg mb-8">Your unique sustainability personality based on your simulation decisions.</p>

      {planetDna === 'Observer' ? (
        <div className="space-y-6">
          <p className="text-xl text-text-primary">You haven't established your Planet DNA yet.</p>
          <button 
            onClick={generateDNA}
            disabled={loading}
            className="bg-accent-purple hover:bg-[#651fff] text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 mx-auto transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Sequence My DNA"}
          </button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-bg-surface/80 border border-accent-purple rounded-2xl p-8"
        >
          <h3 className="text-3xl font-heading font-bold text-accent-purple mb-4 glow-text">{planetDna}</h3>
          <p className="text-lg text-text-primary leading-relaxed">
            {description || "You are a visionary shaping a sustainable future through your dedicated choices and strategic foresight."}
          </p>
          <button 
            onClick={generateDNA}
            className="mt-8 text-sm text-accent-purple hover:text-white underline underline-offset-4"
          >
            Re-evaluate DNA
          </button>
        </motion.div>
      )}
    </div>
  );
}
