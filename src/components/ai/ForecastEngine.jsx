import React, { useState, useEffect, useMemo } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import GlassCard from '../shared/GlassCard';
import { useEmissions } from '../../hooks/useEmissions';
import { useUser } from '../../context/UserContext';
import { useWeatherData } from '../../hooks/useWeatherData';
import { getEmissionForecast } from '../../services/aiService';

export default function ForecastEngine() {
  const { logs, isReady, getDailyTotal } = useEmissions();
  const { user } = useUser();
  const { data: weather } = useWeatherData(user?.city, user?.country);
  
  const [adjustments, setAdjustments] = useState({
    drive: 0,
    meat: 0,
    energy: 0,
    shopping: 0
  });
  
  const [narrative, setNarrative] = useState('');

  // Calculate historical base + unadjusted forecast
  const baseData = useMemo(() => {
    const data = [];
    if (!isReady) return data;

    // Past 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      data.push({
        date: ds.substring(5),
        fullDate: ds,
        historical: getDailyTotal(ds),
        forecast: null,
        isForecast: false
      });
    }

    // Averages per day of week (0=Sun, 1=Mon, etc.) from last 30 days
    const dowTotals = [0,0,0,0,0,0,0];
    const dowCounts = [0,0,0,0,0,0,0];
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    logs.filter(l => new Date(l.timestamp) >= thirtyDaysAgo).forEach(l => {
      const d = new Date(l.timestamp);
      dowTotals[d.getDay()] += l.emissions;
      dowCounts[d.getDay()] += 1;
    });

    const dowAverages = dowTotals.map((t, i) => dowCounts[i] ? t / dowCounts[i] : 4.7);

    // Next 7 days
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const ds = d.toISOString().split('T')[0];
      
      let fcast = dowAverages[d.getDay()];
      
      // Basic weather impact if available (hot -> more energy)
      if (weather && weather.temp > 30) fcast += 0.5;

      data.push({
        date: ds.substring(5),
        fullDate: ds,
        historical: null,
        forecast: fcast,
        baseForecast: fcast,
        isForecast: true
      });
    }

    return data;
  }, [logs, isReady, weather]);

  // Apply real-time what-if adjustments
  const chartData = useMemo(() => {
    return baseData.map(d => {
      if (!d.isForecast) return d;
      
      let adj = d.baseForecast;
      
      // Simple client-side adjustments:
      // Drive: -50% to 50% => translates to roughly +/- 15% of daily total depending on user profile. We'll use a fixed modifier.
      adj += (adjustments.drive / 100) * (d.baseForecast * 0.3); // assume transport is ~30%
      // Meat: 0-7 fewer times a week => roughly -1.5kg per time / 7 days
      adj -= (adjustments.meat * 1.5) / 7;
      // Energy: 0-50% reduction
      adj -= (adjustments.energy / 100) * (d.baseForecast * 0.25);
      // Shopping: 0-5 items fewer
      adj -= (adjustments.shopping * 2.0) / 7;

      return {
        ...d,
        forecast: Math.max(0, adj)
      };
    });
  }, [baseData, adjustments]);

  const baselineTotal = baseData.filter(d => d.isForecast).reduce((s, d) => s + (d.baseForecast || 0), 0);
  const adjustedTotal = chartData.filter(d => d.isForecast).reduce((s, d) => s + (d.forecast || 0), 0);
  const saved = baselineTotal - adjustedTotal;

  useEffect(() => {
    if (isReady && logs.length > 0) {
      getEmissionForecast(chartData, weather).then(setNarrative);
    }
  }, [isReady]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const isHistorical = !!payload[0].payload.historical;
      const val = payload[0].value;
      return (
        <div className="bg-bg-surface border border-[rgba(255,255,255,0.1)] p-2 rounded text-white text-sm shadow-xl">
          <p className="font-medium mb-1">{payload[0].payload.fullDate}</p>
          <p style={{ color: payload[0].color }}>{isHistorical ? 'Logged' : 'Forecast'}: {val.toFixed(1)} kg</p>
        </div>
      );
    }
    return null;
  };

  return (
    <GlassCard title="Emission Forecast">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <ReferenceLine x={chartData.find(d => !d.isForecast && baseData[baseData.indexOf(d)+1]?.isForecast)?.date} stroke="rgba(255,255,255,0.2)" label={{ position: 'top', value: 'Today', fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
              
              <Bar dataKey="historical" fill="var(--accent-teal)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
              <Bar dataKey="forecast" fill="rgba(29, 233, 182, 0.4)" stroke="var(--accent-teal)" strokeDasharray="3 3" radius={[4, 4, 0, 0]} isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
          
          <div className="mt-4 p-3 bg-white/5 rounded-lg border-l-2 border-accent-purple">
            <p className="text-sm text-text-secondary italic">"{narrative || "Analyzing your forecast..."}"</p>
          </div>
        </div>

        <div className="w-full lg:w-1/3 bg-black/20 p-5 rounded-xl border border-white/5 h-fit">
          <h4 className="text-white font-heading font-bold mb-4">Adjust Your Week</h4>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary">Drive {adjustments.drive > 0 ? `${adjustments.drive}% more` : `${Math.abs(adjustments.drive)}% less`}</span>
              </div>
              <input type="range" min="-50" max="50" step="5" value={adjustments.drive} onChange={e => setAdjustments({...adjustments, drive: Number(e.target.value)})} className="w-full accent-accent-teal" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary">Eat meat {adjustments.meat} fewer times</span>
              </div>
              <input type="range" min="0" max="7" value={adjustments.meat} onChange={e => setAdjustments({...adjustments, meat: Number(e.target.value)})} className="w-full accent-accent-green" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary">Reduce energy by {adjustments.energy}%</span>
              </div>
              <input type="range" min="0" max="50" step="5" value={adjustments.energy} onChange={e => setAdjustments({...adjustments, energy: Number(e.target.value)})} className="w-full accent-accent-amber" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary">Fewer purchases: {adjustments.shopping}</span>
              </div>
              <input type="range" min="0" max="5" value={adjustments.shopping} onChange={e => setAdjustments({...adjustments, shopping: Number(e.target.value)})} className="w-full accent-accent-purple" />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="text-sm text-text-secondary">Adjusted Weekly Total:</div>
            <div className="text-2xl font-bold font-heading text-white">{adjustedTotal.toFixed(1)} kg</div>
            {saved > 0.1 && (
              <div className="text-sm text-accent-green font-medium mt-1">
                Saves {saved.toFixed(1)} kg vs baseline
              </div>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
