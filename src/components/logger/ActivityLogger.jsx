import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../shared/GlassCard';
import { calculateEmissions } from '../../utils/carbonCalculator';
import { calculateEntryXP } from '../../utils/xpCalculator';
import { useEmissions } from '../../hooks/useEmissions';
import { useXPSystem } from '../../hooks/useXPSystem';
import { useToast } from '../../context/ToastContext';
import { useGridIntensity } from '../../hooks/useGridIntensity';
import { useUser } from '../../context/UserContext';
import { EMISSION_FACTORS } from '../../utils/emissionFactors';

const TABS = [
  { id: 'transport', icon: '🚗', label: 'Transport' },
  { id: 'energy', icon: '⚡', label: 'Energy' },
  { id: 'food', icon: '🍽️', label: 'Food' },
  { id: 'shopping', icon: '🛍️', label: 'Shopping' },
  { id: 'digital', icon: '💻', label: 'Digital' }
];

export default function ActivityLogger() {
  const [activeTab, setActiveTab] = useState('transport');
  const [inputs, setInputs] = useState({});
  const [previewCO2, setPreviewCO2] = useState(0);
  
  const { addLog, getCategoryAverages } = useEmissions();
  const { addXP, streak, updateStreak } = useXPSystem();
  const { addToast } = useToast();
  const { user } = useUser();
  const { intensityData } = useGridIntensity(user?.country);

  useEffect(() => {
    // Reset inputs when tab changes
    setInputs({ subcategory: getDefaultSubcategory(activeTab) });
    setPreviewCO2(0);
  }, [activeTab]);

  useEffect(() => {
    if (inputs.subcategory) {
      let calcInputs = { ...inputs };
      if (activeTab === 'energy' && inputs.subcategory === 'electricity' && inputs.useLiveGrid && intensityData) {
        calcInputs.gridIntensity = intensityData.intensity;
      }
      const co2 = calculateEmissions(activeTab, inputs.subcategory, calcInputs);
      setPreviewCO2(co2);
    }
  }, [inputs, activeTab, intensityData]);

  const getDefaultSubcategory = (tab) => {
    switch(tab) {
      case 'transport': return 'car_petrol_medium';
      case 'energy': return 'electricity';
      case 'food': return 'beef';
      case 'shopping': return 'tshirt';
      case 'digital': return 'streaming_1080p_hr';
      default: return '';
    }
  };

  const handleLogSubmit = () => {
    const entry = {
      category: activeTab,
      subcategory: inputs.subcategory,
      emissions: previewCO2,
      inputs: { ...inputs }
    };
    
    addLog(entry);
    
    const averages = getCategoryAverages();
    const xpEarned = calculateEntryXP(entry, streak.current, averages[activeTab]);
    addXP(xpEarned);
    updateStreak();

    addToast({
      type: 'success',
      title: 'Activity Logged!',
      message: `+${xpEarned} XP earned 🌱`
    });

    setInputs({ subcategory: getDefaultSubcategory(activeTab) });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'transport':
        return (
          <div className="space-y-4">
            <select value={inputs.subcategory || ''} onChange={e => setInputs({...inputs, subcategory: e.target.value})} className="w-full bg-black/30 border border-white/10 p-3 rounded-lg text-white">
              {Object.keys(EMISSION_FACTORS.transport).map(k => <option key={k} value={k}>{k.replace(/_/g, ' ')}</option>)}
            </select>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm text-text-secondary block mb-1">Distance (km)</label>
                <input type="number" min="0" value={inputs.distance || ''} onChange={e => setInputs({...inputs, distance: Number(e.target.value)})} className="w-full bg-black/30 border border-white/10 p-3 rounded-lg text-white" />
              </div>
              <div className="flex-1">
                <label className="text-sm text-text-secondary block mb-1">Passengers</label>
                <input type="number" min="1" max="6" value={inputs.passengers || 1} onChange={e => setInputs({...inputs, passengers: Number(e.target.value)})} className="w-full bg-black/30 border border-white/10 p-3 rounded-lg text-white" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-white">
              <input type="checkbox" checked={inputs.isReturn || false} onChange={e => setInputs({...inputs, isReturn: e.target.checked})} className="accent-accent-green w-4 h-4" />
              Return journey (x2)
            </label>
          </div>
        );
      case 'energy':
        return (
          <div className="space-y-4">
            <select value={inputs.subcategory || ''} onChange={e => setInputs({...inputs, subcategory: e.target.value})} className="w-full bg-black/30 border border-white/10 p-3 rounded-lg text-white">
              {Object.keys(EMISSION_FACTORS.energy).map(k => <option key={k} value={k}>{k.replace(/_/g, ' ')}</option>)}
              <option value="solar">solar_generation</option>
            </select>
            <div>
              <label className="text-sm text-text-secondary block mb-1">{inputs.subcategory === 'electricity' || inputs.subcategory === 'solar' ? 'kWh' : 'Amount'}</label>
              <input type="number" min="0" value={inputs.amount || inputs.kwh || ''} onChange={e => setInputs({...inputs, amount: Number(e.target.value), kwh: Number(e.target.value)})} className="w-full bg-black/30 border border-white/10 p-3 rounded-lg text-white" />
            </div>
            {inputs.subcategory === 'electricity' && (
              <label className="flex items-center gap-2 text-white">
                <input type="checkbox" checked={inputs.useLiveGrid || false} onChange={e => setInputs({...inputs, useLiveGrid: e.target.checked})} className="accent-accent-green w-4 h-4" />
                Apply live grid intensity ({intensityData?.intensity || 475} gCO₂/kWh)
              </label>
            )}
          </div>
        );
      case 'food':
        return (
          <div className="space-y-4">
            <select value={inputs.subcategory || ''} onChange={e => setInputs({...inputs, subcategory: e.target.value})} className="w-full bg-black/30 border border-white/10 p-3 rounded-lg text-white">
              {Object.keys(EMISSION_FACTORS.food).map(k => <option key={k} value={k}>{k.replace(/_/g, ' ')}</option>)}
            </select>
            <div>
              <label className="text-sm text-text-secondary block mb-1">Portions / Amount</label>
              <input type="number" min="1" value={inputs.amount || 1} onChange={e => setInputs({...inputs, amount: Number(e.target.value)})} className="w-full bg-black/30 border border-white/10 p-3 rounded-lg text-white" />
            </div>
            <div>
              <label className="text-sm text-text-secondary block mb-1">Food Waste %</label>
              <input type="range" min="0" max="100" value={inputs.wastePercent || 0} onChange={e => setInputs({...inputs, wastePercent: Number(e.target.value)})} className="w-full accent-accent-green" />
              <div className="text-right text-xs text-text-secondary">{inputs.wastePercent || 0}%</div>
            </div>
          </div>
        );
      case 'shopping':
        return (
          <div className="space-y-4">
            <select value={inputs.subcategory || ''} onChange={e => setInputs({...inputs, subcategory: e.target.value})} className="w-full bg-black/30 border border-white/10 p-3 rounded-lg text-white">
              {Object.keys(EMISSION_FACTORS.shopping).filter(k=>k!=='secondhand_multiplier').map(k => <option key={k} value={k}>{k.replace(/_/g, ' ')}</option>)}
            </select>
            <div>
              <label className="text-sm text-text-secondary block mb-1">Quantity</label>
              <input type="number" min="1" value={inputs.quantity || 1} onChange={e => setInputs({...inputs, quantity: Number(e.target.value)})} className="w-full bg-black/30 border border-white/10 p-3 rounded-lg text-white" />
            </div>
            <label className="flex items-center gap-2 text-white">
              <input type="checkbox" checked={inputs.isSecondhand || false} onChange={e => setInputs({...inputs, isSecondhand: e.target.checked})} className="accent-accent-green w-4 h-4" />
              Secondhand purchase (70% reduction) ♻️
            </label>
          </div>
        );
      case 'digital':
        return (
          <div className="space-y-4">
            <select value={inputs.subcategory || ''} onChange={e => setInputs({...inputs, subcategory: e.target.value})} className="w-full bg-black/30 border border-white/10 p-3 rounded-lg text-white">
              {Object.keys(EMISSION_FACTORS.digital).map(k => <option key={k} value={k}>{k.replace(/_/g, ' ')}</option>)}
              {Object.keys(EMISSION_FACTORS.crypto).map(k => <option key={k} value={k}>{k.replace(/_/g, ' ')}</option>)}
            </select>
            <div>
              <label className="text-sm text-text-secondary block mb-1">Hours / Quantity</label>
              <input type="number" min="0" value={inputs.hours || inputs.amount || ''} onChange={e => setInputs({...inputs, hours: Number(e.target.value), amount: Number(e.target.value)})} className="w-full bg-black/30 border border-white/10 p-3 rounded-lg text-white" />
            </div>
          </div>
        );
      default: return null;
    }
  };

  const isFormValid = () => {
    if (activeTab === 'transport' && (!inputs.distance || inputs.distance <= 0)) return false;
    if (activeTab === 'energy' && !inputs.amount && !inputs.kwh) return false;
    if (activeTab === 'digital' && !inputs.hours && !inputs.amount) return false;
    return true;
  };

  return (
    <GlassCard className="p-0 overflow-hidden">
      <div className="flex overflow-x-auto border-b border-white/10">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[100px] py-4 text-center text-sm font-medium transition-colors relative
              ${activeTab === tab.id ? 'text-accent-green' : 'text-text-secondary hover:text-white'}`}
          >
            <div className="text-xl mb-1">{tab.icon}</div>
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-green" />
            )}
          </button>
        ))}
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 border-t border-white/10 pt-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-text-secondary">Estimated CO₂</span>
            <span className={`text-2xl font-bold font-heading ${previewCO2 < 0 ? 'text-accent-green' : previewCO2 > 5 ? 'text-accent-red' : 'text-accent-amber'}`}>
              {previewCO2 > 0 ? '+' : ''}{previewCO2.toFixed(2)} kg
            </span>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={!isFormValid()}
            onClick={handleLogSubmit}
            className="w-full bg-accent-green disabled:bg-white/10 text-bg-primary disabled:text-text-secondary py-4 rounded-xl font-bold text-lg transition-colors relative overflow-hidden"
          >
            Log Activity
            {isFormValid() && (
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            )}
          </motion.button>
        </div>
      </div>
    </GlassCard>
  );
}
