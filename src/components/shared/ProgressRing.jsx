import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ProgressRing({ value, size = 120, strokeWidth = 8, color = 'var(--accent-green)', label, sublabel, animated = true }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const progressOffset = ((100 - value) / 100) * circumference;
    if (animated) {
      setOffset(progressOffset);
    } else {
      setOffset(progressOffset); // initial states manage this
    }
  }, [value, circumference, animated]);

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset: offset }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold font-heading" style={{ color }}>{value}</span>
        {label && <span className="text-xs text-text-secondary uppercase tracking-wider">{label}</span>}
        {sublabel && <span className="text-[10px] text-text-secondary mt-1">{sublabel}</span>}
      </div>
    </div>
  );
}
