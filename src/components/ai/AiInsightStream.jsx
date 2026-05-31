import React, { useEffect, useState } from 'react';
import { getDailyInsight } from '../../services/aiService';
import { useEmissions } from '../../hooks/useEmissions';

export default function AiInsightStream() {
  const { logs, isReady } = useEmissions();
  const [insight, setInsight] = useState('');
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!isReady) return;

    const fetchInsight = async () => {
      // Get last 7 days summary
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      
      const recentLogs = logs.filter(l => new Date(l.timestamp) >= sevenDaysAgo);
      const summary = {
        totalKg: recentLogs.reduce((sum, l) => sum + l.emissions, 0),
        count: recentLogs.length,
        categories: [...new Set(recentLogs.map(l => l.category))]
      };

      const result = await getDailyInsight(summary);
      setInsight(result);
    };

    fetchInsight();
  }, [isReady, logs]);

  useEffect(() => {
    if (!insight) return;
    
    setDisplayedText('');
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(insight.substring(0, i + 1));
      i++;
      if (i >= insight.length) {
        clearInterval(intervalId);
      }
    }, 40); // Typewriter speed

    return () => clearInterval(intervalId);
  }, [insight]);

  return (
    <div className="text-xl md:text-2xl font-heading text-text-secondary h-16 md:h-12">
      <span className="text-accent-teal">🤖 </span>
      {displayedText}
      <span className="animate-pulse opacity-50">|</span>
    </div>
  );
}
