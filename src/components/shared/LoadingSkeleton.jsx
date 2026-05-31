import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingSkeleton({ variant = 'text', count = 1, className = '' }) {
  const elements = Array.from({ length: count });

  const getVariantClasses = () => {
    switch (variant) {
      case 'card':
        return 'h-48 rounded-2xl w-full';
      case 'chart':
        return 'h-64 rounded-xl w-full';
      case 'ring':
        return 'h-32 w-32 rounded-full';
      case 'text':
      default:
        return 'h-4 rounded w-full mb-2';
    }
  };

  return (
    <>
      {elements.map((_, i) => (
        <motion.div
          key={i}
          className={`relative overflow-hidden bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] ${getVariantClasses()} ${className}`}
        >
          <motion.div
            className="absolute inset-0 -translate-x-full"
            animate={{ translateX: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
            }}
          />
        </motion.div>
      ))}
    </>
  );
}
