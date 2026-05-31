import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';

const SEASON_COLORS = {
  Spring: { ground: '#4ade80', leaves: '#a3e635', light: '#ffffff' },
  Summer: { ground: '#22c55e', leaves: '#15803d', light: '#ffedd5' },
  Autumn: { ground: '#ca8a04', leaves: '#ea580c', light: '#fed7aa' },
  Winter: { ground: '#f1f5f9', leaves: '#cbd5e1', light: '#e0f2fe' }
};

// Procedural Forest Generation
const generateForest = (count) => {
  const noise2D = createNoise2D();
  const trees = [];
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 40;
    const z = (Math.random() - 0.5) * 40;
    // Don't place trees in the center "lake"
    if (Math.sqrt(x*x + z*z) < 8) continue;
    
    const y = noise2D(x * 0.1, z * 0.1) * 2;
    trees.push({ pos: new THREE.Vector3(x, y, z), scale: 0.5 + Math.random() * 1.5, id: i });
  }
  return trees;
};

// Low Poly Eagle
const Eagle = ({ position, rotation, speed, radius }) => {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius;
    ref.current.rotation.y = -t;
    // Flapping
    ref.current.children[0].rotation.z = Math.sin(t * 10) * 0.5;
    ref.current.children[1].rotation.z = -Math.sin(t * 10) * 0.5;
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh position={[0.5, 0, 0]} castShadow>
        <boxGeometry args={[1.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[-0.5, 0, 0]} castShadow>
        <boxGeometry args={[1.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 0, 0.5]} castShadow>
        <coneGeometry args={[0.3, 1, 4]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

export default function RewildingScene({ healthScore, season, latestDiscovery }) {
  const trees = useMemo(() => generateForest(150), []);
  const terrainRef = useRef();
  const waterRef = useRef();
  const discoveryLightRef = useRef();

  // Interpolation targets
  const colors = SEASON_COLORS[season] || SEASON_COLORS.Spring;
  const isDead = healthScore < 20;

  useFrame((state, delta) => {
    // Terrain & Leaf Color interpolation (dead brown vs vibrant season)
    const targetGround = isDead ? new THREE.Color('#4a3b2c') : new THREE.Color(colors.ground);
    if (terrainRef.current) {
      terrainRef.current.material.color.lerp(targetGround, 0.02);
    }
    
    // Water
    if (waterRef.current) {
      waterRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.1 - 0.5;
      const targetWater = isDead ? new THREE.Color('#2a3b2c') : new THREE.Color('#0ea5e9');
      waterRef.current.material.color.lerp(targetWater, 0.02);
    }

    // Discovery Light Animation (fly around then settle)
    if (discoveryLightRef.current && latestDiscovery) {
      const t = state.clock.getElapsedTime();
      discoveryLightRef.current.position.x = Math.sin(t * 2) * 5;
      discoveryLightRef.current.position.z = Math.cos(t * 2) * 5;
      discoveryLightRef.current.position.y = 2 + Math.sin(t * 5);
      discoveryLightRef.current.intensity = THREE.MathUtils.lerp(discoveryLightRef.current.intensity, 10, 0.1);
    } else if (discoveryLightRef.current) {
      discoveryLightRef.current.intensity = THREE.MathUtils.lerp(discoveryLightRef.current.intensity, 0, 0.1);
    }
  });

  return (
    <group>
      <Sky sunPosition={[10, 10, -10]} turbidity={isDead ? 10 : 0.1} rayleigh={isDead ? 5 : 0.5} />
      <ambientLight intensity={isDead ? 0.2 : 0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow color={colors.light} />
      
      {/* Discovery Cinematic Light */}
      <pointLight ref={discoveryLightRef} color="#00ffaa" distance={20} intensity={0} castShadow />

      {/* Terrain */}
      <mesh ref={terrainRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[100, 100, 32, 32]} />
        <meshStandardMaterial color={colors.ground} roughness={0.8} />
      </mesh>

      {/* Lake */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <circleGeometry args={[8, 32]} />
        <meshStandardMaterial color="#0ea5e9" transparent opacity={0.8} roughness={0.1} />
      </mesh>

      {/* Forest */}
      <group>
        {trees.map((tree) => (
          <group key={tree.id} position={tree.pos} scale={tree.scale}>
            {/* Trunk */}
            <mesh position={[0, 1, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.4, 2]} />
              <meshStandardMaterial color="#5c4033" />
            </mesh>
            {/* Leaves */}
            <mesh position={[0, 3, 0]} castShadow>
              <coneGeometry args={[1.5, 3, 5]} />
              <meshStandardMaterial color={isDead ? '#3a2b1c' : colors.leaves} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ANIMALS (Conditional Spawning based on Health) */}

      {/* Health > 30: Insects/Fireflies */}
      {healthScore >= 30 && (
        <Sparkles count={50} scale={20} size={2} speed={0.4} color={season === 'Winter' ? '#ffffff' : '#fbbf24'} />
      )}

      {/* Health > 50: Butterflies (Stylized planes) */}
      {healthScore >= 50 && season !== 'Winter' && (
        <group position={[0, 2, 0]}>
          <Sparkles count={30} scale={10} size={4} speed={1} color="#3b82f6" />
        </group>
      )}

      {/* Health > 70: Turtles (Floating in lake) */}
      {healthScore >= 70 && (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1} position={[-3, -0.4, 3]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.4, 0.6, 4, 8]} />
            <meshStandardMaterial color="#166534" />
          </mesh>
        </Float>
      )}

      {/* Health > 85: Eagles circling the sky */}
      {healthScore >= 85 && (
        <>
          <Eagle position={[0, 15, 0]} speed={0.5} radius={10} />
          <Eagle position={[0, 12, 0]} speed={0.7} radius={15} rotation={[0, Math.PI, 0]} />
        </>
      )}
    </group>
  );
}
