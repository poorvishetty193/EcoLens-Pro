import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Procedural generation of network nodes
const generateNetwork = () => {
  const nodes = [];
  const connections = [];
  const layers = [1, 5, 12, 20]; // Center, Personal, Community, City/Planet
  const radii = [0, 2, 4.5, 7.5];

  let nodeIndex = 0;
  layers.forEach((count, layerIdx) => {
    const radius = radii[layerIdx];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (layerIdx * 0.5); // Stagger angles
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = Math.sin(angle * 3) * 0.5 + (layerIdx * 0.2); // slight 3D wave

      nodes.push({ id: nodeIndex, position: [x, y, z], layer: layerIdx });

      // Connect to previous layer
      if (layerIdx > 0) {
        const prevLayerNodes = nodes.filter(n => n.layer === layerIdx - 1);
        // Connect to nearest 2 nodes in previous layer
        prevLayerNodes.sort((a, b) => {
          const distA = Math.hypot(a.position[0] - x, a.position[2] - z);
          const distB = Math.hypot(b.position[0] - x, b.position[2] - z);
          return distA - distB;
        });
        
        connections.push([nodeIndex, prevLayerNodes[0].id]);
        if (prevLayerNodes[1]) connections.push([nodeIndex, prevLayerNodes[1].id]);
      }
      nodeIndex++;
    }
  });

  return { nodes, connections };
};

export default function ButterflyScene({ timelineYear, selectedAction, isSimulating, actionLog = [] }) {
  const { nodes, connections } = useMemo(() => generateNetwork(), []);
  const groupRef = useRef();
  const cityRef = useRef();
  const earthRef = useRef();
  const butterflyRef = useRef();
  
  // Calculate simulation progress based on year (2026 - 2050)
  const progress = Math.max(0, Math.min(1, (timelineYear - 2026) / (2050 - 2026)));

  // Galaxy Mode stars based on actionLog
  const galaxyStars = useMemo(() => {
    return actionLog.map((log, i) => {
      // Calculate random positions far in the background
      const angle = (i * 137.5) * (Math.PI / 180); // golden ratio spiral
      const radius = 20 + Math.random() * 30;
      const x = Math.cos(angle) * radius;
      const y = -10 + Math.random() * 40;
      const z = Math.sin(angle) * radius - 20; // push deep into background
      return { id: log.id, position: [x, y, z] };
    });
  }, [actionLog]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    
    // Slowly rotate the entire network
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05;
    }

    // Animate city to earth transformation
    if (cityRef.current && earthRef.current) {
      if (progress > 0.8) {
        // Transition to Earth
        const scaleFactor = (progress - 0.8) * 5; // 0 to 1
        cityRef.current.scale.setScalar(Math.max(0.001, 1 - scaleFactor));
        earthRef.current.scale.setScalar(Math.min(1, scaleFactor));
        earthRef.current.rotation.y += delta * 0.2;
      } else {
        // City mode
        cityRef.current.scale.setScalar(1);
        earthRef.current.scale.setScalar(0.001);
      }
    }

    // Butterfly animation
    if (isSimulating && butterflyRef.current) {
      // Orbiting outward
      const angle = t * 2;
      const radius = Math.min(7.5, t * 1.5);
      butterflyRef.current.position.set(Math.cos(angle) * radius, Math.sin(t * 4) * 0.5, Math.sin(angle) * radius);
    }
  });

  // Line materials
  const lineMaterial = useMemo(() => new THREE.LineBasicMaterial({ 
    color: '#1de9b6', 
    transparent: true, 
    opacity: 0.1 
  }), []);

  const activeLineMaterial = useMemo(() => new THREE.LineBasicMaterial({ 
    color: '#7c4dff', 
    transparent: true, 
    opacity: 0.8 
  }), []);

  return (
    <group>
      {/* Deep Space Background */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Galaxy Mode: Past Actions as Stars */}
      <group>
        {galaxyStars.map((star, i) => (
          <mesh key={star.id} position={star.position}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshBasicMaterial color={i % 2 === 0 ? "#7c4dff" : "#1de9b6"} />
            <pointLight intensity={0.5} distance={10} color={i % 2 === 0 ? "#7c4dff" : "#1de9b6"} />
          </mesh>
        ))}
      </group>

      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#7c4dff" distance={20} />

      {/* Ripple Network */}
      <group ref={groupRef}>
        {/* Lines */}
        {connections.map(([id1, id2], i) => {
          const n1 = nodes[id1];
          const n2 = nodes[id2];
          const points = [new THREE.Vector3(...n1.position), new THREE.Vector3(...n2.position)];
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          
          // Activate lines based on progress
          const requiredProgress = (n2.layer / 3); // 0 to 1
          const isActive = selectedAction && progress >= requiredProgress;

          return (
            <line key={`line-${i}`} geometry={geometry} material={isActive ? activeLineMaterial : lineMaterial} />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const requiredProgress = (node.layer / 3);
          const isActive = selectedAction && progress >= requiredProgress;
          
          return (
            <mesh key={`node-${node.id}`} position={node.position}>
              <sphereGeometry args={[isActive ? 0.15 : 0.05, 16, 16]} />
              <meshBasicMaterial color={isActive ? (node.layer === 0 ? '#ffffff' : '#1de9b6') : '#4a4a4a'} />
              {isActive && (
                <pointLight intensity={0.5} distance={2} color="#1de9b6" />
              )}
            </mesh>
          );
        })}

        {/* The Butterfly Particle */}
        {isSimulating && (
          <mesh ref={butterflyRef}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
            <pointLight intensity={2} distance={5} color="#ffffff" />
            <mesh>
               <sphereGeometry args={[0.3, 16, 16]} />
               <meshBasicMaterial color="#7c4dff" transparent opacity={0.4} />
            </mesh>
          </mesh>
        )}
      </group>

      {/* The City / Earth Below */}
      <group position={[0, -5, 0]}>
        <pointLight intensity={1} distance={10} color="#ffffff" />
        
        {/* City (Low poly abstract) */}
        <group ref={cityRef}>
          {/* Base plate */}
          <mesh rotation={[-Math.PI/2, 0, 0]}>
            <circleGeometry args={[3, 32]} />
            <meshStandardMaterial color={progress > 0.4 ? "#2d4c1e" : "#2a2a2a"} roughness={0.8} />
          </mesh>
          
          {/* Buildings */}
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            const radius = Math.random() * 2.5;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const height = 0.2 + Math.random() * 1.5;
            
            // Buildings become transparent/green as progress increases
            const isGreen = progress > 0.5 && Math.random() > 0.3;

            return (
              <mesh key={i} position={[x, height/2, z]}>
                <boxGeometry args={[0.2, height, 0.2]} />
                <meshStandardMaterial color={isGreen ? "#1de9b6" : "#4a4a4a"} transparent opacity={isGreen ? 0.8 : 1} />
              </mesh>
            );
          })}
        </group>

        {/* Earth Transformation */}
        <group ref={earthRef} scale={0.001}>
          <mesh>
            <sphereGeometry args={[3, 64, 64]} />
            <meshStandardMaterial color="#00e676" emissive="#1a1a2e" emissiveIntensity={0.5} roughness={0.6} />
          </mesh>
          {/* Atmosphere */}
          <mesh>
            <sphereGeometry args={[3.1, 64, 64]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.2} depthWrite={false} />
          </mesh>
        </group>
      </group>

      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2 + 0.2}
        minPolarAngle={Math.PI / 3}
      />
    </group>
  );
}
