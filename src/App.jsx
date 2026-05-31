import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { useUser } from './context/UserContext';
import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';

import Dashboard from './pages/Dashboard';
import LogActivity from './pages/LogActivity';
import AiCenter from './pages/AiCenter';
import Gamification from './pages/Gamification';
import Onboarding from './pages/Onboarding';

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-bg-primary text-text-primary">
      <div className="ambient-glow"></div>
      <div className="ambient-glow-2"></div>
      
      <Sidebar />
      <main className="flex-1 pb-20 lg:pb-0 overflow-x-hidden relative z-10">
        {children}
      </main>
      <MobileNav />
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, isReady } = useUser();
  if (!isReady) return <div className="h-screen flex items-center justify-center text-white">Loading EcoLens...</div>;
  if (!user) return <Navigate to="/onboarding" />;
  return <MainLayout>{children}</MainLayout>;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/log" element={<ProtectedRoute><LogActivity /></ProtectedRoute>} />
        <Route path="/ai" element={<ProtectedRoute><AiCenter /></ProtectedRoute>} />
        <Route path="/gamification" element={<ProtectedRoute><Gamification /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
