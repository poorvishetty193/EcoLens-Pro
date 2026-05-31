import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { SimulationProvider } from './context/SimulationContext';
import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';

// Feature Components Phase 1
import LivingEarth from './components/Earth/LivingEarth';
import FuturePortal from './components/Features/FuturePortal';
import ParallelUniverse from './components/Features/ParallelUniverse';
import AiDebateChamber from './components/Features/AiDebateChamber';
import CityDigitalTwin from './components/Features/CityDigitalTwin';
import ClimateStrategist from './components/Features/ClimateStrategist';
import PlanetDna from './components/Features/PlanetDna';
import EcoQuests from './components/Features/EcoQuests';
import FutureImpactStory from './components/Features/FutureImpactStory';

// Feature Components Phase 2
import GreenMultiverse from './components/Features/GreenMultiverse';
import ClimateNews from './components/Features/ClimateNews';
import DigitalForest from './components/Features/DigitalForest';
import ButterflyEffect from './components/Features/ButterflyEffect';

// Feature Components Phase 3
import TimeCapsule from './components/Features/TimeCapsule';
import GenerationSimulator from './components/Features/GenerationSimulator';
import ClimateBlackBox from './components/Features/ClimateBlackBox';
import SaveTheSpecies from './components/Features/SaveTheSpecies';
import CampusMode from './components/Features/CampusMode';
import AiInventor from './components/Features/AiInventor';

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-bg-primary text-text-primary">
      <div className="ambient-glow"></div>
      <div className="ambient-glow-2"></div>
      
      <Sidebar />
      <main className="flex-1 pb-20 lg:pb-0 overflow-x-hidden relative z-10 custom-scrollbar">
        {children}
      </main>
      <MobileNav />
    </div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LivingEarth />} />
        <Route path="/portal" element={<div className="p-6"><FuturePortal /></div>} />
        <Route path="/multiverse" element={<div className="p-6"><GreenMultiverse /></div>} />
        <Route path="/news" element={<div className="p-6"><ClimateNews /></div>} />
        <Route path="/forest" element={<div className="p-6"><DigitalForest /></div>} />
        <Route path="/butterfly" element={<div className="p-6"><ButterflyEffect /></div>} />
        <Route path="/universe" element={<div className="p-6"><ParallelUniverse /></div>} />
        <Route path="/capsule" element={<div className="p-6"><TimeCapsule /></div>} />
        <Route path="/generation" element={<div className="p-6"><GenerationSimulator /></div>} />
        <Route path="/blackbox" element={<div className="p-6"><ClimateBlackBox /></div>} />
        <Route path="/species" element={<div className="p-6"><SaveTheSpecies /></div>} />
        <Route path="/campus" element={<div className="p-6"><CampusMode /></div>} />
        <Route path="/inventor" element={<div className="p-6"><AiInventor /></div>} />
        <Route path="/debate" element={<div className="p-6"><AiDebateChamber /></div>} />
        <Route path="/city" element={<div className="p-6"><CityDigitalTwin /></div>} />
        <Route path="/strategist" element={<div className="p-6"><ClimateStrategist /></div>} />
        <Route path="/dna" element={<div className="p-6"><PlanetDna /></div>} />
        <Route path="/quests" element={<div className="p-6"><EcoQuests /></div>} />
        <Route path="/story" element={<div className="p-6"><FutureImpactStory /></div>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <SimulationProvider>
      <BrowserRouter>
        <MainLayout>
          <AnimatedRoutes />
        </MainLayout>
      </BrowserRouter>
    </SimulationProvider>
  );
}
