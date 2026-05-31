import React, { useEffect, useState } from 'react';

export default function AnimatedCounter({ value, duration = 1.2, decimals = 1, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;
    const startValue = count;
    const endValue = value;
    const diff = endValue - startValue;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / (duration * 1000), 1);
      
      const ease = 1 - Math.pow(1 - percentage, 3);
      
      setCount(startValue + (diff * ease));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{prefix}{count.toFixed(decimals)}{suffix}</span>;
}
