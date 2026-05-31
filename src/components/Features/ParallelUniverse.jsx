import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ParallelUniverse() {
  const [sliderPos, setSliderPos] = useState(50);

  const handleDrag = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const pos = Math.max(0, Math.min(100, (x / bounds.width) * 100));
    setSliderPos(pos);
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-12">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-heading font-bold text-text-primary mb-2">Parallel Universe Comparison</h2>
        <p className="text-text-secondary">Drag the slider to compare the Current World vs. a Sustainable Future.</p>
      </div>

      <div 
        className="relative w-full h-[500px] rounded-3xl overflow-hidden cursor-ew-resize border border-border-subtle shadow-2xl"
        onMouseMove={(e) => { if (e.buttons === 1) handleDrag(e); }}
        onMouseDown={handleDrag}
      >
        {/* Universe B (Sustainable - Underneath) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a2a1a] to-[#004d2c] flex flex-col justify-center items-end p-12 text-right">
          <h3 className="text-3xl font-heading font-bold text-accent-green mb-4">Sustainable Future</h3>
          <ul className="space-y-4 text-lg text-text-primary">
            <li>CO₂ Emissions: <span className="text-accent-green">Net Zero</span></li>
            <li>Air Quality: <span className="text-accent-green">Excellent (AQI 15)</span></li>
            <li>Energy: <span className="text-accent-green">100% Renewable</span></li>
            <li>Biodiversity: <span className="text-accent-green">Thriving Ecosystems</span></li>
          </ul>
        </div>

        {/* Universe A (Current - On Top, clipped) */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#2d1b1b] flex flex-col justify-center items-start p-12"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <h3 className="text-3xl font-heading font-bold text-accent-red mb-4">Current Trajectory</h3>
          <ul className="space-y-4 text-lg text-text-primary">
            <li>CO₂ Emissions: <span className="text-accent-red">Critically High</span></li>
            <li>Air Quality: <span className="text-accent-amber">Poor (AQI 140)</span></li>
            <li>Energy: <span className="text-accent-red">70% Fossil Fuels</span></li>
            <li>Biodiversity: <span className="text-accent-red">Declining rapidly</span></li>
          </ul>
        </div>

        {/* Slider Handle */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            <div className="w-1 h-4 border-l border-r border-gray-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
