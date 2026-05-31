import React, { useState } from 'react';
import GlassCard from '../shared/GlassCard';
import { useEmissions } from '../../hooks/useEmissions';
import { formatDate, getCategoryColor } from '../../utils/formatters';
import { Trash2 } from 'lucide-react';

const CATEGORY_ICONS = {
  transport: '🚗',
  energy: '⚡',
  food: '🍽️',
  shopping: '🛍️',
  digital: '💻'
};

export default function LogHistory() {
  const { logs, deleteLog, isReady } = useEmissions();
  const [filter, setFilter] = useState('all');

  const filteredLogs = logs.filter(log => filter === 'all' || log.category === filter);

  if (!isReady) return null;

  return (
    <GlassCard title="Activity History">
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border ${filter === 'all' ? 'border-accent-green bg-accent-green/10 text-accent-green' : 'border-white/10 text-text-secondary'}`}>
          All
        </button>
        {Object.keys(CATEGORY_ICONS).map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border capitalize ${filter === cat ? 'border-white bg-white/10 text-white' : 'border-white/10 text-text-secondary'}`}>
            {CATEGORY_ICONS[cat]} {cat}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-text-secondary text-sm">
              <th className="py-3 px-4 font-medium">Date/Time</th>
              <th className="py-3 px-4 font-medium">Activity</th>
              <th className="py-3 px-4 font-medium">CO₂ (kg)</th>
              <th className="py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-text-secondary">No activities found</td>
              </tr>
            ) : (
              filteredLogs.slice(0, 50).map(log => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4">
                    <div className="text-white text-sm">{formatDate(log.timestamp)}</div>
                    <div className="text-text-secondary text-xs">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span>{CATEGORY_ICONS[log.category]}</span>
                      <span className="text-white capitalize text-sm">{log.subcategory.replace(/_/g, ' ')}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-sm" style={{ color: log.emissions > 5 ? 'var(--accent-red)' : log.emissions > 2 ? 'var(--accent-amber)' : 'var(--accent-green)' }}>
                      {log.emissions.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => deleteLog(log.id)} className="text-text-secondary hover:text-accent-red transition-colors p-2">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {filteredLogs.length > 50 && (
        <div className="text-center mt-4 text-text-secondary text-sm">
          Showing 50 most recent entries
        </div>
      )}
    </GlassCard>
  );
}
