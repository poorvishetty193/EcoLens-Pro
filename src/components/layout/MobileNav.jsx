import React from 'react';
import { NavLink } from 'react-router-dom';
import { Globe, Layers, Activity, Bot, Building2 } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', icon: <Globe size={24} /> },
  { path: '/portal', icon: <Layers size={24} /> },
  { path: '/universe', icon: <Activity size={24} /> },
  { path: '/debate', icon: <Bot size={24} /> },
  { path: '/city', icon: <Building2 size={24} /> },
];

export default function MobileNav() {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-bg-surface/80 backdrop-blur-lg border-t border-white/10 z-50 px-6 py-4 flex justify-between items-center">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `
            p-2 rounded-xl transition-all
            ${isActive ? 'text-accent-teal bg-accent-teal/20' : 'text-text-secondary'}
          `}
        >
          {item.icon}
        </NavLink>
      ))}
    </div>
  );
}
