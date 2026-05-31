import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sparkles, Stars, Sphere, Torus, Html } from '@react-three/drei';
import * as THREE from 'three';

export default function CouncilScene({ activeTheme, isInterruption, isVoting, isResolution }) {
  const { camera } = useThree();
  const groupRef = useRef();
  const [pulse, setPulse] = useState(0);

  // Map theme to colors and geometries
  const themeConfig = {
    science: { color: '#00ffaa', secondary: '#004422', speed: 1 },
    economy: { color: '#ffaa00', secondary: '#442200', speed: 0.5 },
    citizen: { color: '#0088ff', secondary: '#002244', speed: 1.5 },
    policy: { color: '#cc00ff', secondary: '#330044', speed: 0.8 },
    default: { color: '#ffffff', secondary: '#222222', speed: 0.2 }
  };

  const current = themeConfig[activeTheme] || themeConfig.default;
  const activeColor = isInterruption ? '#ff0000' : isResolution ? '#00ffff' : current.color;
  const secondaryColor = isInterruption ? '#440000' : current.secondary;

  useEffect(() => {
    // Interruption flash
    if (isInterruption) {
      setPulse(5);
      const timer = setTimeout(() => setPulse(0), 500);
      return () => clearTimeout(timer);
    }
  }, [isInterruption]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isVoting ? 0.05 : current.speed * 0.5);
    }
    
    if (pulse > 0) {
      setPulse(p => Math.max(0, p - delta * 10));
    }

    if (isVoting || isResolution) {
      camera.position.lerp(new THREE.Vector3(0, 0, isResolution ? 8 : 12), 0.02);
    } else {
      camera.position.lerp(new THREE.Vector3(0, 2, 8), 0.02);
    }
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={isVoting ? 0.1 : 0.5} />
      <directionalLight position={[10, 10, 10]} intensity={isInterruption ? 5 : 2} color={activeColor} />
      <pointLight position={[0, 0, 0]} intensity={pulse + 2} color={activeColor} distance={15} />

      {/* Background space/stars */}
      <Stars radius={50} depth={50} count={isVoting ? 5000 : 1000} factor={4} saturation={isResolution ? 1 : 0} fade speed={1} />

      {/* The Reality Projection Table / Hologram */}
      <group ref={groupRef} position={[0, 0, 0]}>
        
        {/* Core Hologram */}
        <Sphere args={[2, 32, 32]} scale={isResolution ? 1.5 : 1}>
          <meshPhongMaterial 
            color={secondaryColor} 
            emissive={activeColor} 
            emissiveIntensity={isVoting ? 0.1 : 0.8 + (pulse * 0.5)} 
            wireframe={!isResolution} 
            transparent 
            opacity={0.8} 
          />
        </Sphere>

        {/* Orbiting Data Rings */}
        {!isVoting && !isResolution && (
          <>
            <Torus args={[3, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
              <meshBasicMaterial color={activeColor} transparent opacity={0.5} />
            </Torus>
            <Torus args={[4, 0.01, 16, 100]} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
              <meshBasicMaterial color={activeColor} transparent opacity={0.3} />
            </Torus>
          </>
        )}

        {/* Floating Data Particles */}
        <Sparkles 
          count={isResolution ? 1000 : 200} 
          scale={isResolution ? 15 : 6} 
          size={isResolution ? 4 : 2} 
          color={activeColor} 
          speed={current.speed * 2} 
        />
        
        {/* Interruption Shockwave */}
        {pulse > 0 && (
          <Sphere args={[2.5 + (5 - pulse), 32, 32]}>
            <meshBasicMaterial color="#ff0000" transparent opacity={pulse * 0.1} wireframe />
          </Sphere>
        )}
      </group>
    </>
  );
}
