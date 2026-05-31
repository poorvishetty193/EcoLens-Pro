import React from 'react';
import { motion } from 'framer-motion';
import LevelProgress from '../components/gamification/LevelProgress';
import DailyMissions from '../components/gamification/DailyMissions';
import BadgeWall from '../components/gamification/BadgeWall';
import StreakTracker from '../components/gamification/StreakTracker';

export default function Gamification() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-2">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Your Journey</h1>
        <p className="text-text-secondary">Level up your planetary impact.</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <LevelProgress />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <DailyMissions />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <BadgeWall />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StreakTracker />
        </motion.div>
      </motion.div>
    </div>
  );
}
