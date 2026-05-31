import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getDebateResponse } from '../../services/ai';
import { Loader2, Zap } from 'lucide-react';

const PersonaCard = ({ title, role, content, delay, color }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5 }}
    className={`bg-bg-surface border ${color} rounded-2xl p-6 flex flex-col`}
  >
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-bg-primary border ${color}`}>
        <span className="font-bold text-sm">{title[0]}</span>
      </div>
      <div>
        <h4 className="font-heading font-bold text-text-primary">{title}</h4>
        <p className="text-xs text-text-secondary">{role}</p>
      </div>
    </div>
    <p className="text-sm text-text-primary flex-1">{content}</p>
  </motion.div>
);

export default function AiDebateChamber() {
  const [decision, setDecision] = useState('');
  const [loading, setLoading] = useState(false);
  const [debate, setDebate] = useState(null);

  const handleDebate = async () => {
    if (!decision) return;
    setLoading(true);
    try {
      const results = await getDebateResponse(decision);
      setDebate(results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-12 p-6">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-heading font-bold text-text-primary mb-4 glow-text">AI Climate Debate Chamber</h2>
        <p className="text-text-secondary text-lg">Propose a climate decision and watch 4 distinct AI personas debate its impact.</p>
      </div>

      <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4 mb-12">
        <input 
          type="text" 
          className="flex-1 bg-bg-surface/50 border border-border-subtle rounded-xl px-6 py-4 text-text-primary focus:outline-none focus:border-accent-purple transition-colors"
          placeholder="e.g. Ban all petrol vehicles by 2030"
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
        />
        <button 
          onClick={handleDebate}
          disabled={loading || !decision}
          className="bg-accent-purple hover:bg-[#651fff] text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Start Debate"}
        </button>
      </div>

      {debate && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PersonaCard 
              title="Environmental Scientist" role="Benefits Focus"
              content={debate.Scientist} delay={0.2} color="border-accent-green text-accent-green" 
            />
            <PersonaCard 
              title="Economist" role="Costs Focus"
              content={debate.Economist} delay={0.4} color="border-accent-amber text-accent-amber" 
            />
            <PersonaCard 
              title="Policy Maker" role="Implementation Challenges"
              content={debate.PolicyMaker} delay={0.6} color="border-accent-teal text-accent-teal" 
            />
            <PersonaCard 
              title="Citizen" role="Daily Life Impact"
              content={debate.Citizen} delay={0.8} color="border-accent-red text-accent-red" 
            />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] border border-accent-purple rounded-3xl p-8 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-accent-purple"></div>
            <Zap className="w-12 h-12 text-accent-purple mx-auto mb-4" />
            <h3 className="text-2xl font-heading font-bold text-white mb-4">Final Recommendation</h3>
            <p className="text-lg text-text-primary max-w-3xl mx-auto">{debate.Recommendation}</p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
