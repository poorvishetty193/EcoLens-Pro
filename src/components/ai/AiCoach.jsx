import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../shared/GlassCard';
import LoadingSkeleton from '../shared/LoadingSkeleton';
import { useEmissions } from '../../hooks/useEmissions';
import { getCoachAnalysis } from '../../services/aiService';
import { useToast } from '../../context/ToastContext';
import { getCategoryColor } from '../../utils/formatters';
import { ChevronRight } from 'lucide-react';

export default function AiCoach() {
  const { logs } = useEmissions();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleAnalyze = async () => {
    setLoading(true);
    
    // Prepare 14-day data
    const today = new Date();
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(today.getDate() - 14);
    
    const recentLogs = logs.filter(l => new Date(l.timestamp) >= twoWeeksAgo);
    const data14Day = {
      totalEmissions: recentLogs.reduce((sum, l) => sum + l.emissions, 0),
      categoryBreakdown: recentLogs.reduce((acc, l) => {
        acc[l.category] = (acc[l.category] || 0) + l.emissions;
        return acc;
      }, {})
    };

    try {
      const result = await getCoachAnalysis(data14Day);
      setAnalysis(result);
    } catch (err) {
      addToast({ type: 'warning', title: 'AI Error', message: err.message || 'Failed to generate coaching analysis' });
    } finally {
      setLoading(false);
    }
  };

  const StrategyCard = ({ strategy }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const diffMap = { 1: '🌱 Easy', 2: '🌱🌱 Medium', 3: '🌱🌱🌱 Hard' };

    return (
      <div 
        className="relative w-full h-32 cursor-pointer perspective-1000"
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full relative preserve-3d transition-all duration-500"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between hover:border-accent-green/50 transition-colors">
            <h4 className="font-heading font-medium text-white">{strategy.action}</h4>
            <div className="flex justify-between items-end">
              <span className="text-xs text-text-secondary">{diffMap[strategy.difficulty]}</span>
              <span className="text-sm font-bold text-accent-green">-{strategy.co2_saved_kg_week} kg/wk</span>
            </div>
          </div>
          
          {/* Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-accent-green/10 border border-accent-green/30 rounded-xl p-4 flex flex-col justify-center items-center text-center">
            <span className="text-xs text-accent-teal uppercase tracking-wider mb-2">{strategy.category}</span>
            <p className="text-sm text-white">{strategy.why_it_matters}</p>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <GlassCard className="h-full flex flex-col md:flex-row gap-8">
      {/* Left Panel */}
      <div className="w-full md:w-1/3 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
        <h2 className="text-2xl font-heading font-bold text-white mb-2">My Eco Coach</h2>
        <p className="text-text-secondary text-sm mb-6">AI-driven personalized strategies based on your last 14 days of activity.</p>
        
        <div className="space-y-3 mb-8">
          <div className="bg-white/5 px-4 py-2 rounded-lg text-sm text-white">🚗 Transport avg: 3.2 kg/day</div>
          <div className="bg-white/5 px-4 py-2 rounded-lg text-sm text-white">🍽️ Food avg: 2.1 kg/day</div>
          <div className="bg-white/5 px-4 py-2 rounded-lg text-sm text-white">⚡ Energy avg: 1.8 kg/day</div>
        </div>
        
        {!analysis && !loading && (
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAnalyze} 
            className="w-full bg-accent-green text-bg-primary font-bold py-4 rounded-xl flex items-center justify-center gap-2"
          >
            Analyze My Footprint <ChevronRight size={20} />
          </motion.button>
        )}
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-2/3 flex-1 min-h-[300px]">
        {loading ? (
          <div className="space-y-4">
            <LoadingSkeleton variant="text" count={2} />
            <div className="grid grid-cols-2 gap-4 mt-6">
              <LoadingSkeleton variant="card" count={2} className="h-32" />
            </div>
          </div>
        ) : analysis ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="border-l-4 border-accent-teal pl-4 py-1">
              <p className="text-white text-lg italic leading-relaxed">{analysis.summary}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {analysis.strategies.map((strat, i) => (
                <StrategyCard key={i} strategy={strat} />
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-accent-green font-medium shadow-accent-green/20 drop-shadow-lg">
                "{analysis.motivational_note}"
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex items-center justify-center text-text-secondary italic">
            Click analyze to receive your personalized coaching report.
          </div>
        )}
      </div>
    </GlassCard>
  );
}
