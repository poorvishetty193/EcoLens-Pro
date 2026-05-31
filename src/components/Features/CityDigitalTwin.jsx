import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export default function CityDigitalTwin() {
  const [params, setParams] = useState({
    population: 500000,
    renewables: 20,
    publicTransport: 30,
    industryLevel: 50
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: parseInt(value) }));
  };

  const data = useMemo(() => {
    const arr = [];
    let currentCarbon = 1000 + (params.population / 1000) * (params.industryLevel / 50) - (params.renewables * 5) - (params.publicTransport * 2);
    let currentEnergy = 500 + (params.population / 2000) + (params.industryLevel * 2);

    for (let year = 2024; year <= 2050; year += 2) {
      arr.push({
        year,
        carbon: Math.max(0, currentCarbon),
        energy: Math.max(0, currentEnergy)
      });
      // Simulate gradual changes over time assuming policies stick
      currentCarbon = currentCarbon * (1 - (params.renewables / 2000));
      currentEnergy = currentEnergy * (1 - (params.publicTransport / 3000));
    }
    return arr;
  }, [params]);

  const score = Math.max(0, Math.min(100, (params.renewables * 1.5) + (params.publicTransport) - (params.industryLevel * 0.5) + 20)).toFixed(0);

  return (
    <div className="w-full max-w-6xl mx-auto my-12 p-6 glass-panel rounded-3xl">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-heading font-bold text-text-primary mb-4 glow-text">City Digital Twin</h2>
        <p className="text-text-secondary text-lg">Modify policies and watch the real-time impact on your city's future.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6 bg-bg-surface p-6 rounded-2xl border border-border-subtle">
          <h3 className="text-xl font-heading font-bold text-white mb-4">City Parameters</h3>
          
          <div>
            <label className="block text-text-secondary mb-2">Population: {params.population.toLocaleString()}</label>
            <input type="range" name="population" min="10000" max="5000000" step="10000" value={params.population} onChange={handleChange} className="w-full accent-accent-green" />
          </div>
          
          <div>
            <label className="block text-text-secondary mb-2">Renewable Energy (%): {params.renewables}%</label>
            <input type="range" name="renewables" min="0" max="100" value={params.renewables} onChange={handleChange} className="w-full accent-accent-teal" />
          </div>

          <div>
            <label className="block text-text-secondary mb-2">Public Transport Usage (%): {params.publicTransport}%</label>
            <input type="range" name="publicTransport" min="0" max="100" value={params.publicTransport} onChange={handleChange} className="w-full accent-accent-amber" />
          </div>

          <div>
            <label className="block text-text-secondary mb-2">Industry Level: {params.industryLevel}</label>
            <input type="range" name="industryLevel" min="10" max="100" value={params.industryLevel} onChange={handleChange} className="w-full accent-accent-red" />
          </div>

          <div className="mt-8 p-4 bg-bg-primary rounded-xl border border-border-subtle text-center">
            <div className="text-sm text-text-secondary mb-1">Sustainability Score</div>
            <div className={`text-4xl font-bold ${score > 70 ? 'text-accent-green' : score > 40 ? 'text-accent-amber' : 'text-accent-red'}`}>
              {score}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-bg-surface p-6 rounded-2xl border border-border-subtle h-[300px]">
            <h4 className="text-text-primary mb-4">Projected Carbon Emissions</h4>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff5252" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ff5252" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="#81c784" />
                <YAxis stroke="#81c784" />
                <Tooltip contentStyle={{ backgroundColor: '#0a1a10', borderColor: '#1de9b6' }} />
                <Area type="monotone" dataKey="carbon" stroke="#ff5252" fillOpacity={1} fill="url(#colorCarbon)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-bg-surface p-6 rounded-2xl border border-border-subtle h-[300px]">
            <h4 className="text-text-primary mb-4">Projected Energy Consumption</h4>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1de9b6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1de9b6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="#81c784" />
                <YAxis stroke="#81c784" />
                <Tooltip contentStyle={{ backgroundColor: '#0a1a10', borderColor: '#1de9b6' }} />
                <Area type="monotone" dataKey="energy" stroke="#1de9b6" fillOpacity={1} fill="url(#colorEnergy)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
