import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useSimulation } from '../../context/SimulationContext';
import * as THREE from 'three';

export default function EarthModel() {
  const meshRef = useRef();
  const cloudsRef = useRef();
  const { healthScore } = useSimulation();

  // Load realistic earth textures
  const [colorMap, normalMap] = useTexture([
    'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    'https://unpkg.com/three-globe/example/img/earth-topology.png'
  ]);

  // Rotate the earth slowly
  useFrame((state, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.05;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.07;
  });

  // Calculate colors based on health score (0 = dark/smog, 100 = vibrant/green)
  const healthRatio = healthScore / 100;
  
  const earthTint = useMemo(() => {
    const deadColor = new THREE.Color('#ffb380'); // Sickly orange/brown tint
    const healthyColor = new THREE.Color('#ffffff'); // Natural colors
    return deadColor.lerp(healthyColor, healthRatio);
  }, [healthRatio]);

  const cloudColor = useMemo(() => {
    const deadColor = new THREE.Color('#4a4a4a'); // Smog
    const healthyColor = new THREE.Color('#ffffff'); // White clouds
    return deadColor.lerp(healthyColor, healthRatio);
  }, [healthRatio]);

  return (
    <group>
      {/* Base Earth Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial 
          map={colorMap}
          normalMap={normalMap}
          color={earthTint}
          roughness={0.6}
          metalness={0.1}
          emissive={new THREE.Color('#1de9b6')}
          emissiveIntensity={healthRatio * 0.15}
        />
      </mesh>

      {/* Clouds / Atmosphere Sphere */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.05, 64, 64]} />
        <meshStandardMaterial
          color={cloudColor}
          transparent={true}
          opacity={0.3 + ((1 - healthRatio) * 0.5)} // More opaque if smoggy
          roughness={1}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
