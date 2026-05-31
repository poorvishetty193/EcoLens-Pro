import React, { useMemo } from 'react';
import GlassCard from '../shared/GlassCard';
import AnimatedCounter from '../shared/AnimatedCounter';
import { useEmissions } from '../../hooks/useEmissions';
import { useUser } from '../../context/UserContext';
import { useGridIntensity } from '../../hooks/useGridIntensity';
import { formatCO2, getScoreColor } from '../../utils/formatters';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import LoadingSkeleton from '../shared/LoadingSkeleton';

export default function HeroMetrics() {
  const { getDailyTotal, getWeeklyTotal, logs, isReady } = useEmissions();
  const { user } = useUser();
  const { intensityData, loading } = useGridIntensity(user?.country);

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const todayTotal = getDailyTotal(todayStr);
  const yesterdayTotal = getDailyTotal(yesterdayStr);
  const weeklyTotal = getWeeklyTotal();

  const delta = todayTotal - yesterdayTotal;
  const deltaColor = delta > 0 ? 'text-accent-red' : 'text-accent-green';
  const deltaText = delta > 0 ? `▲ ${Math.abs(delta).toFixed(1)}kg vs yesterday` : `▼ ${Math.abs(delta).toFixed(1)}kg vs yesterday`;

  const planetScore = user?.baseline?.planet_score || 0; // Or calculated dynamically

  // Sparkline data
  const sparkData = useMemo(() => {
    const data = [];
    for(let i=6; i>=0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      data.push({ val: getDailyTotal(d.toISOString().split('T')[0]) });
    }
    return data;
  }, [logs]); // Recompute when logs change

  if (!isReady) return <LoadingSkeleton variant="card" count={4} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Today */}
      <GlassCard title="Today's CO₂" noPadding className="p-5 flex flex-col justify-between">
        <div className="flex justify-between items-end mb-2">
          <div className="text-4xl font-heading font-bold text-white">
            <AnimatedCounter value={todayTotal} decimals={2} /> <span className="text-xl text-text-secondary">kg</span>
          </div>
        </div>
        <div className={`text-sm font-medium ${deltaColor}`}>{delta === 0 ? 'Equal to yesterday' : deltaText}</div>
        <div className="h-12 mt-2 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <Line type="monotone" dataKey="val" stroke="var(--accent-teal)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Card 2: This Week */}
      <GlassCard title="This Week" noPadding className="p-5 flex flex-col justify-between">
        <div className="text-3xl font-heading font-bold text-white mb-2">
          <AnimatedCounter value={weeklyTotal} decimals={1} /> <span className="text-xl text-text-secondary">kg</span>
        </div>
        <div className="text-sm text-text-secondary mb-4">Tracking well against goal</div>
        <div className="w-full bg-[rgba(255,255,255,0.1)] h-2 rounded-full overflow-hidden">
          <div className="bg-accent-teal h-full rounded-full" style={{ width: `${Math.min((weeklyTotal / 50) * 100, 100)}%` }}></div>
        </div>
      </GlassCard>

      {/* Card 3: Planet Score */}
      <GlassCard title="Planet Health Score" noPadding className="p-5 flex flex-col justify-between">
        <div className="text-5xl font-heading font-bold" style={{ color: getScoreColor(planetScore) }}>
          <AnimatedCounter value={planetScore} decimals={0} />
        </div>
        <div>
          <div className="text-sm text-white font-medium">Top 15% globally</div>
          <div className="text-xs text-text-secondary">Updated after each log</div>
        </div>
      </GlassCard>

      {/* Card 4: Live Grid */}
      <GlassCard title="Live Grid Intensity" noPadding className="p-5 flex flex-col justify-between">
        {loading ? (
          <LoadingSkeleton variant="text" count={2} />
        ) : (
          <>
            <div className="text-4xl font-heading font-bold text-white flex items-end gap-2">
              <AnimatedCounter value={intensityData?.intensity || 0} decimals={0} />
              <span className="text-sm text-text-secondary pb-1">gCO₂/kWh</span>
            </div>
            <div className="mt-2 text-sm text-text-secondary">
              <span className="text-accent-amber font-medium">{intensityData?.fossilPct}%</span> fossil fuels in {intensityData?.zone}
              {intensityData?.isEstimate && <span className="block text-xs mt-1">(Estimated based on world average)</span>}
            </div>
          </>
        )}
      </GlassCard>
    </div>
  );
}
