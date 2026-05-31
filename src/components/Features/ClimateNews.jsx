import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getClimateNews } from '../../services/ai';
import { Loader2, Newspaper } from 'lucide-react';

export default function ClimateNews() {
  const [scenario, setScenario] = useState('');
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState(null);

  const handleGenerateNews = async () => {
    if (!scenario) return;
    setLoading(true);
    try {
      const results = await getClimateNews(scenario);
      setNews(results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-12 p-6">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-heading font-bold text-text-primary mb-4 glow-text">Climate News From The Future</h2>
        <p className="text-text-secondary text-lg">Enter a global scenario and see tomorrow's headlines.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <input 
          type="text" 
          className="flex-1 bg-bg-surface/50 border border-border-subtle rounded-xl px-6 py-4 text-text-primary focus:outline-none focus:border-accent-green transition-colors"
          placeholder="e.g. 80% renewable energy adoption by 2028"
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
        />
        <button 
          onClick={handleGenerateNews}
          disabled={loading || !scenario}
          className="bg-accent-green hover:bg-accent-teal text-bg-primary font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><Newspaper /> Generate News</>}
        </button>
      </div>

      {news && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatePresence>
            {news.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 50, rotateX: -20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: index * 0.4, duration: 0.8, type: 'spring' }}
                className="bg-[#e8e6df] text-[#1a1a1a] p-8 shadow-2xl relative overflow-hidden"
                style={{
                  borderTop: '8px solid #1a1a1a',
                  borderBottom: '2px solid #1a1a1a',
                  fontFamily: '"Times New Roman", Times, serif'
                }}
              >
                {/* News texture effect */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] pointer-events-none"></div>
                
                <div className="text-center border-b-2 border-[#1a1a1a] pb-4 mb-6">
                  <div className="text-sm font-bold tracking-[0.2em] uppercase mb-2">The Global Times</div>
                  <div className="text-5xl font-bold font-heading">{item.year}</div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 leading-tight">
                  "{item.headline}"
                </h3>
                <p className="text-lg leading-relaxed border-l-4 border-accent-green pl-4 italic">
                  {item.snippet}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
