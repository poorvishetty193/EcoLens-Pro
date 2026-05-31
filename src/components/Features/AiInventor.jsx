import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getSustainabilityInventor } from '../../services/ai';
import { Loader2, Lightbulb, TrendingUp, Target, ListChecks } from 'lucide-react';

export default function AiInventor() {
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [invention, setInvention] = useState(null);

  const handleGenerate = async () => {
    if (!problem) return;
    setLoading(true);
    try {
      const res = await getSustainabilityInventor(problem);
      setInvention(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-12 p-6">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-heading font-bold text-text-primary mb-4 glow-text">AI Sustainability Inventor</h2>
        <p className="text-text-secondary text-lg">Enter a climate problem. Let AI instantly generate a startup idea to solve it.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <input 
          type="text" 
          className="flex-1 bg-bg-surface/50 border border-border-subtle rounded-xl px-6 py-4 text-text-primary focus:outline-none focus:border-accent-teal transition-colors"
          placeholder="e.g. Ocean microplastics, Fast fashion waste, Urban heat islands"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />
        <button 
          onClick={handleGenerate}
          disabled={loading || !problem}
          className="bg-accent-teal hover:bg-[#00bfa5] text-bg-primary font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><Lightbulb /> Invent Solution</>}
        </button>
      </div>

      {invention && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bg-surface border border-accent-teal/30 rounded-3xl p-8 glass-panel"
        >
          <div className="flex items-start gap-4 mb-8 pb-8 border-b border-white/10">
            <div className="w-16 h-16 bg-accent-teal/20 text-accent-teal rounded-2xl flex items-center justify-center flex-shrink-0">
              <Lightbulb size={32} />
            </div>
            <div>
              <div className="text-sm text-accent-teal font-bold tracking-widest uppercase mb-1">Generated Startup</div>
              <h3 className="text-3xl font-heading font-bold text-white mb-2">{invention.productName}</h3>
              <p className="text-lg text-text-secondary leading-relaxed">{invention.productIdea}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-bg-primary p-6 rounded-2xl border border-white/5">
              <h4 className="flex items-center gap-2 text-accent-amber font-bold mb-3"><TrendingUp size={20} /> Revenue Model</h4>
              <p className="text-text-primary leading-relaxed">{invention.businessModel}</p>
            </div>
            <div className="bg-bg-primary p-6 rounded-2xl border border-white/5">
              <h4 className="flex items-center gap-2 text-accent-green font-bold mb-3"><Target size={20} /> Impact</h4>
              <p className="text-text-primary leading-relaxed">{invention.sustainabilityImpact}</p>
            </div>
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-accent-blue font-bold mb-4"><ListChecks size={20} /> Implementation Roadmap</h4>
            <div className="space-y-3">
              {invention.implementationPlan.map((step, i) => (
                <div key={i} className="flex gap-4 items-center bg-black/40 p-4 rounded-xl border border-white/5">
                  <div className="w-8 h-8 rounded-full bg-accent-blue/20 text-accent-blue flex items-center justify-center font-bold text-sm shrink-0">
                    {i + 1}
                  </div>
                  <div className="text-text-primary">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
