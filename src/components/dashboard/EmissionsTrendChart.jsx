import React, { useMemo } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Brush } from 'recharts';
import GlassCard from '../shared/GlassCard';
import { useEmissions } from '../../hooks/useEmissions';
import LoadingSkeleton from '../shared/LoadingSkeleton';

export default function EmissionsTrendChart() {
  const { logs, isReady } = useEmissions();

  const data = useMemo(() => {
    const chartData = [];
    const dateMap = {};

    // Generate last 30 days
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      dateMap[dateStr] = 0;
    }

    logs.forEach(log => {
      const dateStr = log.timestamp.split('T')[0];
      if (dateMap[dateStr] !== undefined) {
        dateMap[dateStr] += log.emissions;
      }
    });

    const dates = Object.keys(dateMap).sort();
    
    // Calculate 7-day rolling average
    dates.forEach((date, i) => {
      let sum = 0;
      let count = 0;
      for (let j = Math.max(0, i - 6); j <= i; j++) {
        sum += dateMap[dates[j]];
        count++;
      }
      const rollingAvg = sum / count;

      chartData.push({
        date: date.substring(5), // MM-DD
        fullDate: date,
        daily: dateMap[date],
        avg: rollingAvg
      });
    });

    return chartData;
  }, [logs]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const daily = payload[0]?.value || 0;
      const avg = payload[1]?.value || 0;
      const diff = daily - 4.7;
      return (
        <div className="bg-[#0a1a10] border border-accent-green/30 p-3 rounded-lg shadow-xl backdrop-blur-md">
          <p className="text-white font-medium mb-1">{payload[0]?.payload.fullDate}</p>
          <p className="text-accent-teal">Daily: {daily.toFixed(1)} kg</p>
          <p className="text-accent-amber">7-Day Avg: {avg.toFixed(1)} kg</p>
          <p className={`text-xs mt-1 ${diff > 0 ? 'text-accent-red' : 'text-accent-green'}`}>
            {Math.abs(diff).toFixed(1)} kg {diff > 0 ? 'above' : 'below'} global avg
          </p>
        </div>
      );
    }
    return null;
  };

  if (!isReady) return <LoadingSkeleton variant="chart" />;

  const hasData = logs.length > 0;

  return (
    <GlassCard title="30-Day Emission Trend" className="h-[400px]">
      {!hasData && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-bg-primary/50 backdrop-blur-sm rounded-xl">
          <p className="text-text-secondary">Start logging to see your trend</p>
        </div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
          <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={4.7} stroke="var(--accent-red)" strokeDasharray="3 3" label={{ position: 'top', value: 'Global Avg', fill: 'var(--accent-red)', fontSize: 10 }} />
          <Bar dataKey="daily" fill="var(--accent-teal)" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={1200} />
          <Line type="monotone" dataKey="avg" stroke="var(--accent-amber)" strokeWidth={2} dot={false} strokeDasharray="5 5" isAnimationActive={true} animationDuration={1200} />
          <Brush dataKey="date" height={30} stroke="var(--accent-green)" fill="var(--bg-surface)" tickFormatter={() => ''} />
        </ComposedChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}
