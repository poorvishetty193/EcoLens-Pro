import React, { useEffect, useState } from 'react';
import GlassCard from '../shared/GlassCard';
import { useWeatherData } from '../../hooks/useWeatherData';
import { useUser } from '../../context/UserContext';
import { useEmissions } from '../../hooks/useEmissions';
import { getWeatherEmoji } from '../../utils/formatters';
import { getDailyInsight } from '../../services/aiService';
import LoadingSkeleton from '../shared/LoadingSkeleton';
import { Wind, Droplets } from 'lucide-react';

export default function WeatherImpactWidget() {
  const { user } = useUser();
  const { data, loading, error } = useWeatherData(user?.city, user?.country);
  const { getDailyTotal } = useEmissions();
  const [insight, setInsight] = useState('');
  
  const todayKg = getDailyTotal(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (data && !insight) {
      const fetchInsight = async () => {
        // We reuse the generic daily insight prompt from aiService, but tailor it if we had a specific weather service
        // Since aiService doesn't have a strict getWeatherInsight, we'll adapt getDailyInsight or do a custom call here.
        // For PRD: "Gemini micro-insight... It's 34°C today — your AC likely added ~2.1kg CO₂."
        setInsight(`It's ${Math.round(data.temp)}°C today. AI is analyzing impact...`);
        
        try {
          const aiResponse = await getDailyInsight({ weather: data, todayEmissions: todayKg });
          setInsight(aiResponse);
        } catch(e) {
          setInsight(data.temp > 25 ? `It's warm at ${Math.round(data.temp)}°C. Cooling likely increased your footprint.` : `It's ${Math.round(data.temp)}°C. Heating might impact your energy use.`);
        }
      };
      fetchInsight();
    }
  }, [data]);

  if (loading) return <GlassCard title="Weather Impact"><LoadingSkeleton variant="card" /></GlassCard>;
  if (error || !data) return <GlassCard title="Weather Impact"><div className="text-text-secondary">Weather data unavailable</div></GlassCard>;

  const getAqiColor = (aqi) => {
    if (aqi <= 50) return 'bg-accent-green';
    if (aqi <= 100) return 'bg-accent-amber';
    return 'bg-accent-red';
  };

  return (
    <GlassCard title="Weather & Impact" className="h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="text-6xl">{getWeatherEmoji(data.weatherCode)}</div>
          <div>
            <div className="text-4xl font-heading font-bold text-white">{Math.round(data.temp)}°</div>
            <div className="text-text-secondary text-sm capitalize">{user?.city}</div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-text-secondary mb-1">AQI</div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getAqiColor(data.aqi)}`}></div>
            <span className="text-xl font-bold text-white">{data.aqi}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[rgba(255,255,255,0.05)] p-3 rounded-lg flex items-center gap-3">
          <Droplets className="text-accent-teal" size={20} />
          <div>
            <div className="text-xs text-text-secondary">Humidity</div>
            <div className="text-white font-medium">{data.humidity}%</div>
          </div>
        </div>
        <div className="bg-[rgba(255,255,255,0.05)] p-3 rounded-lg flex items-center gap-3">
          <Wind className="text-accent-teal" size={20} />
          <div>
            <div className="text-xs text-text-secondary">Wind</div>
            <div className="text-white font-medium">{data.wind} km/h</div>
          </div>
        </div>
      </div>

      <div className="mt-auto border-t border-[rgba(255,255,255,0.1)] pt-4">
        <div className="text-sm text-white italic flex gap-2 items-start">
          <span className="text-accent-purple">✨</span>
          <span className="leading-relaxed">{insight}</span>
        </div>
      </div>
    </GlassCard>
  );
}
