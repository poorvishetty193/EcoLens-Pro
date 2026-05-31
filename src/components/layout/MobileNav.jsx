import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Edit3, Bot, Trophy } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Dash', icon: <Home size={20} /> },
  { path: '/log', label: 'Log', icon: <Edit3 size={20} /> },
  { path: '/ai', label: 'AI', icon: <Bot size={20} /> },
  { path: '/gamification', label: 'Play', icon: <Trophy size={20} /> }
];

export default function MobileNav() {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#050f0a]/90 backdrop-blur-xl border-t border-white/10 z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center w-full h-full transition-colors relative
              ${isActive ? 'text-accent-green' : 'text-text-secondary'}
            `}
          >
            {({ isActive }) => (
              <>
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110 mb-1' : 'scale-100 mb-1'}`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] font-medium transition-opacity ${isActive ? 'opacity-100' : 'opacity-70'}`}>{item.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 w-8 h-1 bg-accent-green rounded-t-full shadow-[0_0_10px_rgba(0,230,118,0.8)]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
