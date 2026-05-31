import React from 'react';
import { motion } from 'framer-motion';
import { useSimulation } from '../../context/SimulationContext';
import { Archive, PlayCircle } from 'lucide-react';

export default function ClimateBlackBox() {
  const { actionHistory } = useSimulation();

  return (
    <div className="w-full max-w-4xl mx-auto my-12 p-6">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-heading font-bold text-text-primary mb-4 glow-text">Climate Black Box</h2>
        <p className="text-text-secondary text-lg">A permanent record of every decision you made during this simulation.</p>
      </div>

      <div className="bg-[#1a1a1a] border border-[#ff5722] rounded-3xl p-8 shadow-[0_0_30px_rgba(255,87,34,0.15)] relative overflow-hidden">
        {/* Black Box Texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 p-6 opacity-30">
          <Archive size={100} className="text-[#ff5722]" />
        </div>

        <div className="relative z-10 flex items-center justify-between border-b border-[#ff5722]/30 pb-4 mb-6">
          <h3 className="text-2xl font-bold font-heading text-[#ff5722] uppercase tracking-widest">Flight Data Recorder</h3>
          <div className="flex items-center gap-2 text-[#ff5722] font-mono bg-[#ff5722]/10 px-3 py-1 rounded">
            <div className="w-3 h-3 bg-[#ff5722] rounded-full animate-pulse"></div>
            RECORDING
          </div>
        </div>

        <div className="relative z-10 max-h-[500px] overflow-y-auto custom-scrollbar pr-4 space-y-4 font-mono text-sm">
          {actionHistory.length === 0 ? (
            <div className="text-center text-text-secondary py-12">No data recorded yet. Take action in the simulation.</div>
          ) : (
            actionHistory.map((action, i) => (
              <motion.div 
                key={action.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-4 bg-black/50 border border-[#ff5722]/20 rounded-lg hover:border-[#ff5722]/50 transition-colors"
              >
                <div className="text-[#ff5722]/60 pt-1 flex-shrink-0">
                  <PlayCircle size={16} />
                </div>
                <div className="flex-1">
                  <div className="text-[#ff5722]/80 mb-1">[{action.date} - T+{action.id.toString().slice(-6)}]</div>
                  <div className="text-white text-base">{action.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-[#ff5722]/80 mb-1">IMPACT</div>
                  <div className={`font-bold ${action.impact >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                    {action.impact >= 0 ? '+' : ''}{action.impact}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
