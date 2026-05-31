import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Html, Line, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const CAMPAIGNS = [
  { id: 'amazon', name: 'Restore the Amazon', pos: [-1, 0.5, 2], rot: [0.2, -0.4, 0] },
  { id: 'coral', name: 'Save Coral Reefs', pos: [1.5, -0.5, -1.5], rot: [-0.2, 2.5, 0] },
  { id: 'plastic', name: 'Ocean Plastic Cleanup', pos: [-1.5, 0.2, -1.8], rot: [0.1, -2, 0] },
  { id: 'renewable', name: 'Renewable Frontier', pos: [0.5, 1.5, 1], rot: [0.8, 0.5, 0] }
];

export default function CampaignScene({ completedCampaigns, onSelectCampaign, activeCampaign }) {
  const earthRef = useRef();

  useFrame((state, delta) => {
    if (earthRef.current) {
      // Slow rotation unless a specific campaign is active
      if (!activeCampaign) {
        earthRef.current.rotation.y += delta * 0.1;
      }
    }
  });

  return (
    <group>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} color="#00ffaa" />
      <directionalLight position={[-5, -3, -5]} intensity={0.5} color="#0088ff" />

      {/* Background Starfield */}
      <Sparkles count={200} scale={20} size={1} speed={0.2} color="#ffffff" />

      <group ref={earthRef}>
        {/* Holographic Earth Sphere */}
        <mesh>
          <icosahedronGeometry args={[2, 4]} />
          <meshBasicMaterial color="#003322" wireframe transparent opacity={0.3} />
        </mesh>
        
        {/* Core Glow */}
        <mesh>
          <sphereGeometry args={[1.9, 32, 32]} />
          <meshPhongMaterial color="#001122" emissive="#002233" transparent opacity={0.9} />
        </mesh>

        {/* Campaign Markers */}
        {CAMPAIGNS.map((campaign) => {
          const isCompleted = completedCampaigns.includes(campaign.id);
          const isActive = activeCampaign === campaign.id;
          
          return (
            <group key={campaign.id} position={campaign.pos} rotation={campaign.rot}>
              
              {/* Marker/Monument Interaction Zone */}
              <mesh 
                onClick={(e) => { e.stopPropagation(); onSelectCampaign(campaign); }}
                onPointerOver={() => document.body.style.cursor = 'pointer'}
                onPointerOut={() => document.body.style.cursor = 'auto'}
              >
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshBasicMaterial transparent opacity={0} /> {/* Invisible hit area */}
              </mesh>

              {isCompleted ? (
                // Legacy Monument (Glowing Blue/Green Pillar)
                <group>
                  <mesh position={[0, 0.4, 0]}>
                    <cylinderGeometry args={[0.02, 0.05, 0.8]} />
                    <meshBasicMaterial color="#00ffaa" />
                  </mesh>
                  <mesh position={[0, 0.8, 0]}>
                    <octahedronGeometry args={[0.1]} />
                    <meshBasicMaterial color="#00ffaa" />
                  </mesh>
                  <Sparkles count={10} scale={0.5} size={2} color="#00ffaa" />
                </group>
              ) : (
                // Crisis Marker (Glowing Red/Orange Pulse)
                <group>
                  <mesh>
                    <torusGeometry args={[0.15, 0.02, 16, 32]} rotation={[Math.PI / 2, 0, 0]} />
                    <meshBasicMaterial color={isActive ? "#ffaa00" : "#ff3300"} />
                  </mesh>
                  {/* Ping Animation Sphere */}
                  <mesh scale={isActive ? 1.5 : 1}>
                    <sphereGeometry args={[0.05, 16, 16]} />
                    <meshBasicMaterial color={isActive ? "#ffaa00" : "#ff3300"} />
                  </mesh>
                  {/* Floating Label */}
                  <Html position={[0, 0.3, 0]} center className="pointer-events-none">
                    <div className={`px-2 py-1 bg-black/60 backdrop-blur-md rounded border text-xs font-mono whitespace-nowrap ${isActive ? 'text-[#ffaa00] border-[#ffaa00]' : 'text-[#ff3300] border-[#ff3300]'}`}>
                      {campaign.name}
                    </div>
                  </Html>
                </group>
              )}
            </group>
          );
        })}
      </group>
    </group>
  );
}
