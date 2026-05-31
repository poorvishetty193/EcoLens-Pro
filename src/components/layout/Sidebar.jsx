import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Edit3, Bot, Trophy } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import ProgressRing from '../shared/ProgressRing';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: <Home size={22} /> },
  { path: '/log', label: 'Log Activity', icon: <Edit3 size={22} /> },
  { path: '/ai', label: 'AI Center', icon: <Bot size={22} /> },
  { path: '/gamification', label: 'Gamification', icon: <Trophy size={22} /> }
];

export default function Sidebar() {
  const { user, level } = useUser();

  if (!user) return null;

  return (
    <div className="hidden lg:flex flex-col w-64 h-screen border-r border-white/5 bg-bg-surface/50 backdrop-blur-md sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-heading font-bold text-white tracking-wide">
          <span className="text-accent-green">🌿 EcoLens</span> Pro
        </h1>
      </div>

      <div className="flex-1 px-4 mt-6 space-y-2">
        {NAV_ITEMS.map((item, i) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-xl transition-all relative overflow-hidden group
              ${isActive ? 'text-accent-green bg-accent-green/10' : 'text-text-secondary hover:text-white hover:bg-white/5'}
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="sidebarActive" 
                    className="absolute left-0 top-0 bottom-0 w-1 bg-accent-green shadow-[0_0_10px_rgba(0,230,118,0.8)]" 
                  />
                )}
                <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
                <span className="font-medium text-sm">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 m-4 bg-black/20 rounded-2xl flex items-center gap-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-green/5 to-transparent"></div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-bg-primary" style={{ backgroundColor: user.color || 'var(--accent-green)' }}>
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-white truncate">{user.username}</div>
          <div className="text-xs text-text-secondary truncate">Level {level}</div>
        </div>
        <div className="transform scale-[0.3] -mr-8 -my-8">
          <ProgressRing value={user.baseline?.planet_score || 0} size={100} strokeWidth={10} color="var(--accent-green)" />
        </div>
      </div>
    </div>
  );
}
