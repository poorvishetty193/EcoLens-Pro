import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const UNIVERSES = [
  { id: 'A', name: 'Business as Usual', color: '#ff4d4d', pos: [-6, 2, -10] },
  { id: 'B', name: 'Renewable Transition', color: '#ffb300', pos: [6, -2, -12] },
  { id: 'C', name: 'Aggressive Action', color: '#00e676', pos: [-4, -3, -8] },
  { id: 'D', name: 'Tech Breakthrough', color: '#1de9b6', pos: [5, 3, -6] }
];

export default function MultiverseScene({ viewMode, activeUniverse, compareUniverse, timelineYear }) {
  const groupRef = useRef();
  const collisionFlashRef = useRef();
  const earthTexture = useTexture('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');

  // Calculate normalized time (0 to 1) between 2026 and 2100
  const timeProgress = Math.max(0, Math.min(1, (timelineYear - 2026) / (2100 - 2026)));

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      if (viewMode === 'cosmos' || viewMode === 'comparison') {
        // Slowly rotate the entire cosmos
        groupRef.current.rotation.y += delta * 0.1;
      } else {
        // Lock rotation when focused on a single universe
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.05);
      }
    }

    if (viewMode === 'collision' && collisionFlashRef.current) {
      // Flash intensity spikes
      collisionFlashRef.current.intensity = Math.min(10, collisionFlashRef.current.intensity + delta * 5);
    }
  });

  const getPlanetMaterialArgs = (id, progress) => {
    if (id === 'A') {
      // Degrades to grey/brown
      return { 
        color: new THREE.Color('#ffffff').lerp(new THREE.Color('#8a7967'), progress),
        emissive: new THREE.Color('#ff4d4d'),
        emissiveIntensity: progress * 0.5 
      };
    }
    if (id === 'C' || id === 'D') {
      // Becomes vibrant green/teal
      return { 
        color: new THREE.Color('#ffffff'),
        emissive: new THREE.Color(id === 'C' ? '#00e676' : '#1de9b6'),
        emissiveIntensity: 0.2 + progress * 0.6 
      };
    }
    return { color: '#ffffff' }; // Default B
  };

  return (
    <group>
      <Stars radius={100} depth={50} count={8000} factor={4} saturation={0} fade speed={2} />
      <ambientLight intensity={0.2} />

      <group ref={groupRef}>
        {UNIVERSES.map((u, i) => {
          const isFocused = viewMode === 'universe' && activeUniverse?.id === u.id;
          const isComparing = viewMode === 'comparison';
          const isColliding = viewMode === 'collision';
          
          let targetPos = new THREE.Vector3(...u.pos);
          let targetScale = 1;

          if (isFocused) {
            targetPos.set(0, 0, 0);
            targetScale = 3;
          } else if (isComparing) {
            const angle = (i / 4) * Math.PI * 2;
            targetPos.set(Math.cos(angle) * 8, 0, Math.sin(angle) * 8);
          } else if (isColliding) {
            if (activeUniverse?.id === u.id) {
              targetPos.set(-2, 0, 0); // Move to left center
              targetScale = 2;
            } else if (compareUniverse?.id === u.id) {
              targetPos.set(2, 0, 0); // Move to right center
              targetScale = 2;
            } else {
              targetScale = 0; // Hide others
            }
          } else if (viewMode === 'universe') {
            targetScale = 0; // Hide non-focused in universe view
          }

          const matArgs = getPlanetMaterialArgs(u.id, timeProgress);

          return (
            <group 
              key={u.id} 
              position={targetPos}
              scale={targetScale}
            >
              {/* Portal Ring */}
              {viewMode !== 'universe' && (
                <mesh>
                  <torusGeometry args={[1.5, 0.05, 16, 100]} />
                  <meshBasicMaterial color={u.color} transparent opacity={0.8} />
                  <pointLight color={u.color} intensity={2} distance={10} />
                </mesh>
              )}
              
              {/* The Planet */}
              <mesh>
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial 
                  map={earthTexture}
                  roughness={0.6}
                  metalness={0.1}
                  {...matArgs}
                />
              </mesh>

              {/* Atmosphere/Smog based on timeProgress for Universe A */}
              {u.id === 'A' && isFocused && (
                <mesh>
                  <sphereGeometry args={[1.05, 32, 32]} />
                  <meshStandardMaterial color="#4a4a4a" transparent opacity={timeProgress * 0.8} depthWrite={false} />
                </mesh>
              )}
            </group>
          );
        })}
      </group>

      {/* Collision Flash Light */}
      {viewMode === 'collision' && (
        <pointLight ref={collisionFlashRef} position={[0, 0, 0]} color="#ffffff" intensity={0} distance={50} />
      )}

      <OrbitControls 
        enableZoom={viewMode === 'universe'} 
        minDistance={4} 
        maxDistance={15} 
        enablePan={false}
        autoRotate={viewMode === 'comparison'} 
        autoRotateSpeed={0.5} 
      />
    </group>
  );
}
