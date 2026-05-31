import React from 'react';
import { motion } from 'framer-motion';
import HeroMetrics from '../components/dashboard/HeroMetrics';
import EmissionsTrendChart from '../components/dashboard/EmissionsTrendChart';
import CategoryBreakdownRing from '../components/dashboard/CategoryBreakdownRing';
import WeatherImpactWidget from '../components/dashboard/WeatherImpactWidget';
import PlanetHealthScore from '../components/dashboard/PlanetHealthScore';
import { useUser } from '../context/UserContext';

export default function Dashboard() {
  const { user } = useUser();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Welcome back, {user?.username}</h1>
          <p className="text-text-secondary">Here's your planetary impact summary.</p>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <motion.div variants={itemVariants}>
          <HeroMetrics />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <EmissionsTrendChart />
          </motion.div>
          <div className="space-y-6 lg:col-span-1 flex flex-col">
            <motion.div variants={itemVariants} className="flex-1">
              <CategoryBreakdownRing />
            </motion.div>
            <motion.div variants={itemVariants} className="h-48">
              <WeatherImpactWidget />
            </motion.div>
          </div>
        </div>

        <motion.div variants={itemVariants}>
          <PlanetHealthScore />
        </motion.div>
      </motion.div>
    </div>
  );
}
