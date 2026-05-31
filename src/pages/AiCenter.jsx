import React from 'react';
import { motion } from 'framer-motion';
import AiInsightStream from '../components/ai/AiInsightStream';
import AiCoach from '../components/ai/AiCoach';
import ForecastEngine from '../components/ai/ForecastEngine';
import ScenarioSimulator from '../components/ai/ScenarioSimulator';

export default function AiCenter() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-heading font-bold text-white mb-4">Your AI Climate Intelligence</h1>
        <AiInsightStream />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        <motion.div variants={itemVariants}>
          <AiCoach />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ForecastEngine />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ScenarioSimulator />
        </motion.div>
      </motion.div>
    </div>
  );
}
