import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Layers, Activity, Bot, Building2, BrainCircuit, Fingerprint, Shield, Clapperboard, Newspaper, Trees, GitBranch, Share2, Mail, PersonStanding, Archive, Leaf, GraduationCap, Lightbulb } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Living Earth', icon: <Globe size={20} /> },
  { path: '/portal', label: 'Future Portal', icon: <Layers size={20} /> },
  { path: '/multiverse', label: 'Green Multiverse', icon: <GitBranch size={20} /> },
  { path: '/news', label: 'Future News', icon: <Newspaper size={20} /> },
  { path: '/forest', label: 'Digital Forest', icon: <Trees size={20} /> },
  { path: '/butterfly', label: 'Butterfly Effect', icon: <Share2 size={20} /> },
  { path: '/universe', label: 'Parallel Universe', icon: <Activity size={20} /> },
  { path: '/capsule', label: 'Time Capsule', icon: <Mail size={20} /> },
  { path: '/generation', label: 'Gen Simulator', icon: <PersonStanding size={20} /> },
  { path: '/blackbox', label: 'Black Box', icon: <Archive size={20} /> },
  { path: '/species', label: 'Save Species', icon: <Leaf size={20} /> },
  { path: '/campus', label: 'Campus Mode', icon: <GraduationCap size={20} /> },
  { path: '/inventor', label: 'AI Inventor', icon: <Lightbulb size={20} /> },
  { path: '/debate', label: 'Debate Chamber', icon: <Bot size={20} /> },
  { path: '/city', label: 'City Twin', icon: <Building2 size={20} /> },
  { path: '/strategist', label: 'Strategist AI', icon: <BrainCircuit size={20} /> },
  { path: '/dna', label: 'Planet DNA', icon: <Fingerprint size={20} /> },
  { path: '/quests', label: 'Eco Quests', icon: <Shield size={20} /> },
  { path: '/story', label: 'Impact Story', icon: <Clapperboard size={20} /> }
];

export default function Sidebar() {
  return (
    <div className="hidden lg:flex flex-col w-72 h-screen border-r border-white/5 bg-bg-surface/50 backdrop-blur-md sticky top-0 custom-scrollbar overflow-y-auto">
      <div className="p-6 sticky top-0 bg-bg-surface/90 backdrop-blur-md z-10 border-b border-white/5">
        <h1 className="text-2xl font-heading font-bold text-white tracking-wide flex items-center gap-2">
          <Globe className="text-accent-teal" /> EcoVerse <span className="text-accent-teal font-light">AI</span>
        </h1>
        <p className="text-xs text-text-secondary mt-1 tracking-wider uppercase">Future Earth Simulator</p>
      </div>

      <div className="flex-1 px-4 mt-6 space-y-1 pb-6">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-xl transition-all relative overflow-hidden group
              ${isActive ? 'text-accent-teal bg-accent-teal/10' : 'text-text-secondary hover:text-white hover:bg-white/5'}
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="sidebarActive" 
                    className="absolute left-0 top-0 bottom-0 w-1 bg-accent-teal shadow-[0_0_10px_rgba(29,233,182,0.8)]" 
                  />
                )}
                <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
                <span className="font-medium text-sm">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
