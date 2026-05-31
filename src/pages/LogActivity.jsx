import React from 'react';
import QuickLogBar from '../components/logger/QuickLogBar';
import ActivityLogger from '../components/logger/ActivityLogger';
import LogHistory from '../components/logger/LogHistory';
import { motion } from 'framer-motion';

export default function LogActivity() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Log Activity</h1>
        <p className="text-text-secondary">Every action counts. Record your footprint.</p>
      </div>

      <QuickLogBar />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        <motion.div variants={itemVariants} className="lg:col-span-5">
          <ActivityLogger />
        </motion.div>
        
        <motion.div variants={itemVariants} className="lg:col-span-7">
          <LogHistory />
        </motion.div>
      </motion.div>
    </div>
  );
}
