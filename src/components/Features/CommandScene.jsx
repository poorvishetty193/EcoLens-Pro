import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sparkles, Stars, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

// Map 0-100 to appropriate 3D coordinates/scales
const getStrategyNode = (strategy, index, total) => {
  const angle = (index / total) * Math.PI * 2;
  const distance = 4 + (strategy.cost / 100) * 8; // Cost = distance from center
  const scale = 0.5 + (strategy.impact / 100) * 1.5; // Impact = size
  
  let color = '#00ffaa'; // Easy
  if (strategy.difficulty === 'Medium') color = '#ffaa00';
  if (strategy.difficulty === 'Hard') color = '#ff3300';

  return {
    ...strategy,
    pos: [Math.cos(angle) * distance, Math.sin(angle * 2) * 2, Math.sin(angle) * distance],
    scale,
    color
  };
};

export default function CommandScene({ strategies = [], activeStrategies = [], isDeploying }) {
  const { camera } = useThree();
  const galaxyRef = useRef();
  const earthRef = useRef();
  
  const nodes = useMemo(() => {
    return strategies.map((s, i) => getStrategyNode(s, i, strategies.length));
  }, [strategies]);

  useEffect(() => {
    if (!isDeploying) {
      camera.position.set(0, 8, 15);
      camera.lookAt(0, 0, 0);
    }
  }, [isDeploying, camera]);

  useFrame((state, delta) => {
    if (galaxyRef.current && !isDeploying) {
      galaxyRef.current.rotation.y += delta * 0.1;
    }
    
    if (earthRef.current && isDeploying) {
      earthRef.current.rotation.y += delta * 0.5;
    }

    if (isDeploying) {
      // Cinematic zoom into Earth
      camera.position.lerp(new THREE.Vector3(0, 0, 3), 0.02);
      camera.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} color="#0088ff" />
      <pointLight position={[0, 0, 0]} intensity={2} color="#00ffaa" distance={20} />

      <Stars radius={50} depth={50} count={3000} factor={4} saturation={1} fade speed={isDeploying ? 5 : 1} />

      {/* The Cost vs Impact Galaxy */}
      <group ref={galaxyRef} visible={!isDeploying}>
        {/* Core Sun/Server */}
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#0088ff" wireframe />
        </mesh>
        
        {/* Strategy Nodes (Planets) */}
        {nodes.map(node => {
          const isActive = activeStrategies.includes(node.id);
          return (
            <group key={node.id} position={node.pos}>
              <mesh scale={node.scale}>
                <icosahedronGeometry args={[1, 2]} />
                <meshStandardMaterial 
                  color={node.color} 
                  emissive={node.color} 
                  emissiveIntensity={isActive ? 1 : 0.2}
                  wireframe={!isActive}
                />
              </mesh>
              {isActive && (
                <Sparkles count={20} scale={node.scale * 1.5} size={2} color={node.color} />
              )}
              {/* Node Label */}
              <Html position={[0, node.scale + 0.5, 0]} center className="pointer-events-none">
                <div className={`px-2 py-1 text-[10px] font-mono whitespace-nowrap rounded border ${isActive ? 'bg-black/80 text-white border-white' : 'bg-black/40 text-white/50 border-white/10'}`}>
                  {node.title}
                </div>
              </Html>
            </group>
          );
        })}
      </group>

      {/* The Final Earth Hologram Reveal */}
      <group ref={earthRef} visible={isDeploying}>
        <mesh>
          <sphereGeometry args={[1.5, 64, 64]} />
          <meshPhongMaterial color="#001122" emissive="#004433" transparent opacity={0.9} />
        </mesh>
        <mesh scale={1.05}>
          <icosahedronGeometry args={[1.5, 5]} />
          <meshBasicMaterial color="#00ffaa" wireframe transparent opacity={0.3} />
        </mesh>
        <Sparkles count={500} scale={4} size={1} speed={2} color="#00ffaa" />
      </group>
    </>
  );
}
