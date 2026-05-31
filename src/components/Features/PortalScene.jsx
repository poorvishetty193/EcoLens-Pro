import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere, Torus, Stars, Sparkles, Cloud } from '@react-three/drei';
import * as THREE from 'three';

export default function PortalScene({ stage, earthState }) {
  const { camera } = useThree();
  const groupRef = useRef();
  const earthRef = useRef();

  // Procedural rings for the portal
  const rings = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      radius: 2 + Math.random() * 3,
      tube: 0.02 + Math.random() * 0.05,
      speed: (Math.random() - 0.5) * 4,
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0]
    }));
  }, []);

  useFrame((state, delta) => {
    // Camera movement based on stage
    if (stage === 'portal-spawning') {
      camera.position.lerp(new THREE.Vector3(0, 0, 10), 0.02);
    } else if (stage === 'portal-entry') {
      // Fly into the portal
      camera.position.lerp(new THREE.Vector3(0, 0, 0.5), 0.05);
    } else if (stage === 'timeline') {
      // Pull back to reveal Earth
      camera.position.lerp(new THREE.Vector3(0, 0, 8), 0.05);
    } else if (stage === 'collapse') {
      // Pull far back as it collapses
      camera.position.lerp(new THREE.Vector3(0, 0, 20), 0.01);
    } else {
      camera.position.lerp(new THREE.Vector3(0, 0, 15), 0.05);
    }
    camera.lookAt(0, 0, 0);

    if (groupRef.current) {
      groupRef.current.rotation.z += delta * (stage === 'portal-entry' ? 2 : 0.5);
    }
    
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.2;
    }
  });

  const portalColor = earthState?.color || '#00aaff';

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 3, 5]} intensity={2} color={portalColor} />
      <pointLight position={[0, 0, 0]} intensity={stage === 'portal-spawning' ? 5 : 2} color={portalColor} distance={20} />

      <Stars radius={50} depth={50} count={stage === 'portal-entry' ? 5000 : 2000} factor={4} saturation={0} fade speed={stage === 'portal-entry' ? 10 : 1} />

      <group ref={groupRef} position={[0, 0, 0]}>
        
        {/* PORTAL STAGE */}
        {(stage === 'portal-spawning' || stage === 'portal-entry') && (
          <>
            {rings.map((ring, i) => (
              <Torus key={i} args={[ring.radius, ring.tube, 16, 100]} rotation={ring.rotation}>
                <meshPhongMaterial color={portalColor} emissive={portalColor} emissiveIntensity={2} transparent opacity={0.8} />
              </Torus>
            ))}
            <Sparkles count={2000} scale={10} size={4} speed={5} color={portalColor} />
          </>
        )}

        {/* EARTH STAGE */}
        {(stage === 'timeline' || stage === 'collapse') && (
          <group ref={earthRef}>
            {/* Core Earth */}
            <Sphere args={[2.5, 64, 64]}>
              <meshPhongMaterial 
                color="#001122" 
                emissive={portalColor} 
                emissiveIntensity={earthState?.atmosphere || 0.5} 
                wireframe={stage === 'collapse'}
              />
            </Sphere>
            
            {/* Atmosphere */}
            <Sphere args={[2.6, 32, 32]}>
              <meshPhongMaterial 
                color={portalColor} 
                transparent 
                opacity={0.2} 
                blending={THREE.AdditiveBlending}
                side={THREE.BackSide}
              />
            </Sphere>

            {/* Clouds/Particles based on atmosphere density */}
            <Sparkles 
              count={500 * (earthState?.atmosphere || 1)} 
              scale={6} 
              size={2} 
              color={portalColor} 
              speed={0.2} 
            />
          </group>
        )}

      </group>
    </>
  );
}
