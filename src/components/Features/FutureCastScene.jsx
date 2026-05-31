import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Torus, Stars } from '@react-three/drei';
import * as THREE from 'three';

export default function FutureCastScene({ isEmergency, activeChannel }) {
  const groupRef = useRef();

  // Colors based on channel
  const channelColors = {
    environment: '#00ffaa',
    economy: '#ffaa00',
    society: '#00aaff',
    default: '#ffffff'
  };

  const activeColor = isEmergency ? '#ff0033' : (channelColors[activeChannel] || channelColors.default);

  // Procedural Data Rings
  const rings = useMemo(() => {
    return Array.from({ length: 3 }).map((_, i) => ({
      radius: 3 + i * 0.5,
      speed: (Math.random() - 0.5) * 2,
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0]
    }));
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isEmergency ? 0.8 : 0.2);
    }
  });

  return (
    <>
      <ambientLight intensity={isEmergency ? 0.2 : 0.5} />
      <directionalLight position={[10, 10, 10]} intensity={isEmergency ? 4 : 2} color={activeColor} />
      
      <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

      <group ref={groupRef} position={[0, 0, 0]}>
        
        {/* Core Globe (Wireframe) */}
        <Sphere args={[2.5, 32, 32]}>
          <meshPhongMaterial 
            color={isEmergency ? '#220000' : '#001122'} 
            emissive={activeColor} 
            emissiveIntensity={isEmergency ? 0.5 : 0.2} 
            wireframe 
            transparent 
            opacity={0.3} 
          />
        </Sphere>

        {/* Inner Solid Core */}
        <Sphere args={[2.4, 32, 32]}>
          <meshPhongMaterial 
            color="#000000" 
            emissive={activeColor} 
            emissiveIntensity={isEmergency ? 0.2 : 0.1} 
            transparent 
            opacity={0.8} 
          />
        </Sphere>

        {/* Orbiting Data Rings */}
        {rings.map((ring, i) => (
          <Torus key={i} args={[ring.radius, 0.01, 16, 100]} rotation={ring.rotation}>
            <meshBasicMaterial color={activeColor} transparent opacity={0.4} />
          </Torus>
        ))}

        {/* Emergency Pulse */}
        {isEmergency && (
          <Sphere args={[3, 32, 32]}>
            <meshBasicMaterial color="#ff0000" transparent opacity={0.1} wireframe />
          </Sphere>
        )}
      </group>
    </>
  );
}
