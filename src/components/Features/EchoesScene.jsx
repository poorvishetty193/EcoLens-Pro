import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';

const generateCity = (size, density) => {
  const buildings = [];
  for (let x = -size; x < size; x++) {
    for (let z = -size; z < size; z++) {
      if (Math.random() < density) {
        // Leave center open
        if (Math.abs(x) < 2 && Math.abs(z) < 2) continue;
        
        const height = Math.random() * 4 + 1;
        buildings.push({
          id: `b_${x}_${z}`,
          pos: [x * 1.5, height / 2, z * 1.5],
          scale: [1, height, 1],
          isHighrise: height > 3.5
        });
      }
    }
  }
  return buildings;
};

export default function EchoesScene({ year, isFinale }) {
  const { camera } = useThree();
  const cityRef = useRef();
  
  // Static city generation
  const buildings = useMemo(() => generateCity(12, 0.6), []);

  // Determine styling based on year
  const isEarly = year < 2035;
  const isMid = year >= 2035 && year < 2050;
  const isLate = year >= 2050;

  const bldgColor = isEarly ? '#333333' : isMid ? '#4ade80' : '#00ffff';
  const groundColor = isEarly ? '#111111' : isMid ? '#14532d' : '#020617';
  const fogColor = isEarly ? '#222222' : isMid ? '#003322' : '#000000';

  useEffect(() => {
    // Reset camera if not finale
    if (!isFinale) {
      camera.position.set(0, 10, 20);
      camera.lookAt(0, 0, 0);
    }
  }, [year, isFinale, camera]);

  useFrame((state, delta) => {
    if (cityRef.current) {
      // Very slow pan
      cityRef.current.rotation.y += delta * 0.05;
    }

    if (isFinale) {
      // Cinematic Zoom Out to Space
      camera.position.lerp(new THREE.Vector3(0, 150, 300), 0.01);
      camera.lookAt(0, 0, 0);
    } else {
      // Gentle floating camera
      camera.position.x = Math.sin(state.clock.elapsedTime * 0.2) * 5;
      camera.position.y = 8 + Math.cos(state.clock.elapsedTime * 0.1) * 2;
      camera.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      <color attach="background" args={[fogColor]} />
      <fog attach="fog" args={[fogColor, 10, isFinale ? 500 : 50]} />
      
      <ambientLight intensity={isLate ? 0.8 : 0.3} />
      <directionalLight position={[10, 10, 10]} intensity={isEarly ? 0.5 : 1.5} color={isMid ? '#4ade80' : '#ffffff'} />
      <pointLight position={[0, 5, 0]} intensity={isLate ? 2 : 0} color="#00ffff" distance={30} />

      {/* Finale Stars */}
      {isFinale && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}

      <group ref={cityRef}>
        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color={groundColor} />
        </mesh>

        {/* Buildings */}
        {buildings.map(b => (
          <mesh key={b.id} position={b.pos} scale={b.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial 
              color={bldgColor} 
              wireframe={isLate} 
              emissive={isLate && b.isHighrise ? '#00ffff' : '#000000'}
              emissiveIntensity={0.5}
            />
            {/* Green Roofs in Mid-Era */}
            {isMid && (
              <mesh position={[0, 0.51, 0]}>
                <planeGeometry args={[1, 1]} rotation={[-Math.PI / 2, 0, 0]} />
                <meshBasicMaterial color="#22c55e" />
              </mesh>
            )}
          </mesh>
        ))}

        {/* Smog (Early) */}
        {isEarly && <Sparkles count={500} scale={20} size={5} speed={0.2} color="#555555" opacity={0.5} />}
        
        {/* Flying Cars / Sci-Fi Light Trails (Late) */}
        {isLate && <Sparkles count={200} scale={25} size={2} speed={3} color="#00ffff" />}
        {isLate && <Sparkles count={100} scale={25} size={2} speed={4} color="#ff00ff" />}
      </group>
    </>
  );
}
