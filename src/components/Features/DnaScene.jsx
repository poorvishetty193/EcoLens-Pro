import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Float, Stars, Trail } from '@react-three/drei';
import * as THREE from 'three';

const DNA_COLORS = {
  'Business As Usual': { primary: '#ff3300', secondary: '#ffaa00', bond: '#441100' },
  'Sustainable': { primary: '#00ffaa', secondary: '#0088ff', bond: '#003322' },
  'Innovation': { primary: '#aa00ff', secondary: '#00d4ff', bond: '#220044' },
  'Climate Leader': { primary: '#ffffff', secondary: '#ff00aa', bond: '#333333' }
};

const generateDna = (count, radius, height, twists) => {
  const points = [];
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const angle = t * Math.PI * 2 * twists;
    const y = (t - 0.5) * height;
    
    // Strand A
    points.push({ id: `a_${i}`, pos: new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius), type: 'strandA' });
    // Strand B
    points.push({ id: `b_${i}`, pos: new THREE.Vector3(Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius), type: 'strandB' });
    
    // Connecting bonds (every 3 points)
    if (i % 3 === 0) {
      points.push({ id: `bond_${i}`, pos: new THREE.Vector3(0, y, 0), type: 'bond', rot: [0, -angle, 0], length: radius * 2 });
    }
  }
  return points;
};

const MEMORY_CRYSTALS = [
  { id: 1, pos: [3, 2, 2], speed: 1.2 },
  { id: 2, pos: [-4, 0, -2], speed: 0.8 },
  { id: 3, pos: [2, -3, -3], speed: 1.5 }
];

export default function DnaScene({ timeline, isExtracting }) {
  const groupRef = useRef();
  const dnaData = useMemo(() => generateDna(60, 2, 12, 3), []);
  const colors = DNA_COLORS[timeline] || DNA_COLORS['Sustainable'];
  
  const targetPrimary = useMemo(() => new THREE.Color(colors.primary), [colors.primary]);
  const targetSecondary = useMemo(() => new THREE.Color(colors.secondary), [colors.secondary]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Spin the DNA
      groupRef.current.rotation.y += delta * (isExtracting ? 2.0 : 0.2);
    }
  });

  return (
    <group>
      {/* Background Galaxy */}
      <Stars radius={50} depth={50} count={isExtracting ? 5000 : 2000} factor={4} saturation={1} fade speed={isExtracting ? 3 : 1} />
      
      {/* Core Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={isExtracting ? 5 : 2} color={colors.primary} distance={20} />
      
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* DNA Strands & Bonds */}
        {dnaData.map((item) => {
          if (item.type === 'bond') {
            return (
              <mesh key={item.id} position={item.pos} rotation={item.rot}>
                <cylinderGeometry args={[0.05, 0.05, item.length]} rotation={[0, 0, Math.PI / 2]} />
                <meshBasicMaterial color={colors.bond} transparent opacity={0.6} />
              </mesh>
            );
          }

          const isStrandA = item.type === 'strandA';
          return (
            <mesh key={item.id} position={item.pos}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshBasicMaterial color={isStrandA ? colors.primary : colors.secondary} />
              
              {/* Outer Glow */}
              <mesh>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshBasicMaterial color={isStrandA ? colors.primary : colors.secondary} transparent opacity={0.3} blending={THREE.AdditiveBlending} />
              </mesh>
            </mesh>
          );
        })}

        {/* Floating Sparkles inside Helix */}
        <Sparkles count={100} scale={4} size={2} speed={0.5} color={colors.primary} />
      </group>

      {/* DNA Memory Crystals (orbiting) */}
      {!isExtracting && MEMORY_CRYSTALS.map((crystal) => (
        <Float key={crystal.id} speed={crystal.speed} rotationIntensity={2} floatIntensity={2}>
          <group position={crystal.pos}>
            <Trail width={0.5} length={4} color={colors.secondary} attenuation={(t) => t * t}>
              <mesh>
                <octahedronGeometry args={[0.5]} />
                <meshStandardMaterial color={colors.secondary} emissive={colors.secondary} emissiveIntensity={2} wireframe />
              </mesh>
            </Trail>
          </group>
        </Float>
      ))}

    </group>
  );
}
