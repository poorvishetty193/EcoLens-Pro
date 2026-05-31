import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getCampusSimulation } from '../../services/ai';
import { Loader2, GraduationCap, Building, Zap, Leaf, Droplet } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function CampusMode() {
  const [params, setParams] = useState({
    students: 10000,
    buildings: 20,
    cafeterias: 5
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await getCampusSimulation(params);
      setResults(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = results ? [
    { name: 'Energy Savings', value: results.energySavings, color: '#f59e0b' },
    { name: 'Waste Reduction', value: results.wasteReduction, color: '#10b981' },
    { name: 'Carbon (tons/yr)', value: results.carbonReduction, color: '#3b82f6' }
  ] : [];

  return (
    <div className="w-full max-w-6xl mx-auto my-12 p-6">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-heading font-bold text-text-primary mb-4 glow-text">University Campus Simulator</h2>
        <p className="text-text-secondary text-lg">Input your hackathon campus data and simulate the sustainability impact.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Controls */}
        <div className="lg:w-1/3 bg-bg-surface/50 border border-border-subtle rounded-3xl p-6 glass-panel h-fit">
          <h3 className="text-xl font-bold font-heading mb-6 flex items-center gap-2">
            <GraduationCap className="text-accent-blue" /> Campus Parameters
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-text-secondary mb-2 flex justify-between">
                <span>Student Population</span>
                <span className="text-accent-blue font-bold">{params.students.toLocaleString()}</span>
              </label>
              <input 
                type="range" min="1000" max="50000" step="1000"
                value={params.students}
                onChange={e => setParams({...params, students: parseInt(e.target.value)})}
                className="w-full accent-accent-blue"
              />
            </div>
            
            <div>
              <label className="block text-sm text-text-secondary mb-2 flex justify-between">
                <span>Academic Buildings</span>
                <span className="text-accent-amber font-bold">{params.buildings}</span>
              </label>
              <input 
                type="range" min="5" max="100" step="1"
                value={params.buildings}
                onChange={e => setParams({...params, buildings: parseInt(e.target.value)})}
                className="w-full accent-accent-amber"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2 flex justify-between">
                <span>Cafeterias / Dining Halls</span>
                <span className="text-accent-green font-bold">{params.cafeterias}</span>
              </label>
              <input 
                type="range" min="1" max="20" step="1"
                value={params.cafeterias}
                onChange={e => setParams({...params, cafeterias: parseInt(e.target.value)})}
                className="w-full accent-accent-green"
              />
            </div>

            <button 
              onClick={handleSimulate}
              disabled={loading}
              className="w-full bg-accent-blue hover:bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-8"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Building /> Run Campus Simulation</>}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:w-2/3">
          {results ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full"
            >
              {/* Stats Cards */}
              <div className="space-y-4">
                <div className="bg-bg-surface border border-accent-amber/30 rounded-2xl p-6 flex items-center gap-4">
                  <div className="p-3 bg-accent-amber/20 rounded-xl text-accent-amber"><Zap size={24} /></div>
                  <div>
                    <div className="text-sm text-text-secondary">Energy Savings</div>
                    <div className="text-2xl font-bold text-accent-amber">{results.energySavings}%</div>
                  </div>
                </div>
                <div className="bg-bg-surface border border-accent-green/30 rounded-2xl p-6 flex items-center gap-4">
                  <div className="p-3 bg-accent-green/20 rounded-xl text-accent-green"><Leaf size={24} /></div>
                  <div>
                    <div className="text-sm text-text-secondary">Waste Reduction</div>
                    <div className="text-2xl font-bold text-accent-green">{results.wasteReduction}%</div>
                  </div>
                </div>
                <div className="bg-bg-surface border border-accent-blue/30 rounded-2xl p-6 flex items-center gap-4">
                  <div className="p-3 bg-accent-blue/20 rounded-xl text-accent-blue"><Droplet size={24} /></div>
                  <div>
                    <div className="text-sm text-text-secondary">Carbon Reduction</div>
                    <div className="text-2xl font-bold text-accent-blue">{results.carbonReduction} tons/yr</div>
                  </div>
                </div>
              </div>

              {/* Chart & Summary */}
              <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 flex flex-col justify-between">
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-4 bg-bg-primary rounded-xl border border-white/5">
                  <p className="text-sm text-text-primary leading-relaxed">
                    "{results.summary}"
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-text-secondary p-12 border-2 border-dashed border-border-subtle rounded-3xl">
              <Building size={48} className="mb-4 opacity-50" />
              <p>Configure your campus and run the simulation to see potential impact.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
