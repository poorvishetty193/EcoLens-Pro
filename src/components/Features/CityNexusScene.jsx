import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Sky } from '@react-three/drei';
import * as THREE from 'three';

const generateCity = (size, density) => {
  const buildings = [];
  const trees = [];
  
  for (let x = -size; x < size; x++) {
    for (let z = -size; z < size; z++) {
      if (Math.abs(x) < 2 && Math.abs(z) < 2) continue; // Center core space
      
      const rand = Math.random();
      if (rand < density) {
        buildings.push({
          id: `b_${x}_${z}`,
          pos: [x * 1.2, 0, z * 1.2],
          height: Math.random() * 3 + 0.5,
          isIndustrial: Math.random() < 0.3
        });
      } else if (rand > 0.8) {
        trees.push({
          id: `t_${x}_${z}`,
          pos: [x * 1.2, 0, z * 1.2],
          scale: Math.random() * 0.5 + 0.5
        });
      }
    }
  }
  return { buildings, trees };
};

export default function CityNexusScene({ policies, year, isDeploying }) {
  const cityRef = useRef();
  
  // Static generation
  const { buildings, trees } = useMemo(() => generateCity(15, 0.5), []);

  // Map policies to visual states
  const smogIntensity = (policies.industry / 100) * (1 - (policies.renewables / 100));
  const coreHealth = (policies.renewables + policies.forests + policies.transport - policies.industry + 100) / 200; // 0 to 1
  
  const bldgColor = new THREE.Color().lerpColors(new THREE.Color('#333333'), new THREE.Color('#00ffaa'), policies.renewables / 100);
  const indColor = new THREE.Color().lerpColors(new THREE.Color('#441111'), new THREE.Color('#222222'), (100 - policies.industry) / 100);
  const coreColor = new THREE.Color().lerpColors(new THREE.Color('#ff0000'), new THREE.Color('#00ffaa'), coreHealth);

  useFrame((state, delta) => {
    if (cityRef.current && !isDeploying) {
      cityRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[0, 2, 0]} intensity={coreHealth * 5} color={coreColor} distance={20} />

      <Sky turbidity={smogIntensity * 10 + 0.1} rayleigh={smogIntensity * 5 + 0.1} inclination={0.5} distance={400} />

      <group ref={cityRef} position={[0, -2, 0]}>
        
        {/* City Health Core */}
        <mesh position={[0, 2, 0]}>
          <octahedronGeometry args={[1, 0]} />
          <meshPhongMaterial color={coreColor} emissive={coreColor} emissiveIntensity={coreHealth * 2} wireframe={!isDeploying} />
        </mesh>
        <Sparkles position={[0, 2, 0]} count={100 * coreHealth} scale={3} size={2} color={coreColor} speed={2} />

        {/* Buildings */}
        {buildings.map(b => (
          <mesh key={b.id} position={[b.pos[0], b.height / 2, b.pos[2]]} scale={[1, b.height, 1]}>
            <boxGeometry args={[0.8, 1, 0.8]} />
            <meshStandardMaterial 
              color={b.isIndustrial ? indColor : bldgColor} 
              emissive={b.isIndustrial ? '#000000' : (policies.renewables > 50 ? '#003322' : '#000000')}
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}

        {/* Urban Forests */}
        {trees.map(t => {
          const treeScale = t.scale * (policies.forests / 100);
          return treeScale > 0.1 ? (
            <mesh key={t.id} position={[t.pos[0], treeScale / 2, t.pos[2]]} scale={[0.4, treeScale, 0.4]}>
              <cylinderGeometry args={[0, 1, 1, 4]} />
              <meshStandardMaterial color="#22c55e" />
            </mesh>
          ) : null;
        })}

        {/* Industrial Smog Particles */}
        {smogIntensity > 0.1 && (
          <Sparkles count={500 * smogIntensity} scale={30} size={10} speed={0.5} color="#444444" opacity={0.6} />
        )}
        
        {/* Public Transport Pulse Lines (approximated with sparkles for now) */}
        {policies.transport > 30 && (
          <Sparkles count={300 * (policies.transport / 100)} scale={30} size={1.5} speed={4} color="#0088ff" position={[0, 0.5, 0]} />
        )}
      </group>
    </>
  );
}
