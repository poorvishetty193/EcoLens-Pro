import React, { useState, useMemo } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../shared/GlassCard';
import { useEmissions } from '../../hooks/useEmissions';
import { getCategoryColor } from '../../utils/formatters';
import { Edit2, Trash2, X } from 'lucide-react';

export default function CategoryBreakdownRing() {
  const { logs, isReady, deleteLog } = useEmissions();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter(l => l.timestamp.startsWith(todayStr));

  const data = useMemo(() => {
    const totals = { transport: 0, energy: 0, food: 0, shopping: 0, digital: 0 };
    todayLogs.forEach(l => totals[l.category] += l.emissions);

    return [
      { name: 'Transport', value: totals.transport, fill: getCategoryColor('transport') },
      { name: 'Energy', value: totals.energy, fill: getCategoryColor('energy') },
      { name: 'Food', value: totals.food, fill: getCategoryColor('food') },
      { name: 'Shopping', value: totals.shopping, fill: getCategoryColor('shopping') },
      { name: 'Digital', value: totals.digital, fill: getCategoryColor('digital') }
    ].filter(d => d.value > 0);
  }, [todayLogs]);

  const totalKg = data.reduce((sum, d) => sum + d.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-bg-surface border border-[rgba(255,255,255,0.1)] p-2 rounded text-white text-sm">
          {payload[0].payload.name}: {payload[0].value.toFixed(1)} kg
        </div>
      );
    }
    return null;
  };

  const handleCategoryClick = (data) => {
    if (data && data.name) {
      setSelectedCategory(data.name.toLowerCase());
    }
  };

  return (
    <GlassCard title="Today's Breakdown" className="h-[400px] relative overflow-hidden">
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-full text-text-secondary">
          No activities logged today.
        </div>
      ) : (
        <div className="relative h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" barSize={15} data={data} startAngle={90} endAngle={-270}>
              <RadialBar minAngle={15} background={{ fill: 'rgba(255,255,255,0.05)' }} clockWise dataKey="value" cornerRadius={10} onClick={handleCategoryClick} className="cursor-pointer hover:opacity-80 transition-opacity" isAnimationActive={true} animationDuration={1000} />
              <RechartsTooltip content={<CustomTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-heading font-bold text-white">{totalKg.toFixed(1)}</span>
            <span className="text-sm text-text-secondary">kg CO₂</span>
          </div>
        </div>
      )}

      {/* Slide-in Drawer for category details */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="absolute top-0 right-0 bottom-0 w-3/4 sm:w-2/3 bg-bg-surface/95 backdrop-blur-xl border-l border-white/10 z-20 p-5 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-heading text-white capitalize flex items-center gap-2">
                <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: getCategoryColor(selectedCategory) }}></span>
                {selectedCategory}
              </h4>
              <button onClick={() => setSelectedCategory(null)} className="p-1 hover:bg-white/10 rounded-full text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-3">
              {todayLogs.filter(l => l.category === selectedCategory).map(log => (
                <div key={log.id} className="bg-white/5 border border-white/5 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <div className="text-white capitalize text-sm">{log.subcategory}</div>
                    <div className="text-text-secondary text-xs">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium" style={{ color: getCategoryColor(selectedCategory) }}>{log.emissions.toFixed(1)} kg</span>
                    <button onClick={() => deleteLog(log.id)} className="text-text-secondary hover:text-accent-red transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
