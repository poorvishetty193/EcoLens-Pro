import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// Procedurally generate trees/tech positions
const generateFoliage = (count, radius) => {
  const items = [];
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    items.push({ pos: new THREE.Vector3(x, y, z), id: i, type: Math.random() > 0.3 ? 'tree' : 'solar' });
  }
  return items;
};

export default function RealityShiftScene({ shiftProgress }) {
  const normalizedShift = shiftProgress / 100; // 0 to 1
  
  const coreRef = useRef();
  const smogRef = useRef();
  const planetGroupRef = useRef();
  
  const foliage = useMemo(() => generateFoliage(150, 4.1), []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Rotate planet slowly
    if (planetGroupRef.current) {
      planetGroupRef.current.rotation.y += delta * 0.1;
      planetGroupRef.current.rotation.x += delta * 0.05;
    }

    // Pulse Core (Heartbeat)
    if (coreRef.current) {
      // Pulse faster and brighter as normalizedShift increases
      const pulseSpeed = THREE.MathUtils.lerp(1, 4, normalizedShift);
      const scaleBase = THREE.MathUtils.lerp(3.8, 4.0, normalizedShift);
      const pulse = Math.sin(t * pulseSpeed) * 0.05;
      
      coreRef.current.scale.setScalar(scaleBase + pulse);
      
      // Interpolate Core Color: Dark Red -> Vibrant Cyan/Green
      const deadColor = new THREE.Color('#ff2a00');
      const aliveColor = new THREE.Color('#00ffaa');
      coreRef.current.material.color.lerpColors(deadColor, aliveColor, normalizedShift);
      coreRef.current.material.emissive.lerpColors(deadColor, aliveColor, normalizedShift);
      coreRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(0.5, 2.0, normalizedShift);
    }

    // Rotate and Fade Smog
    if (smogRef.current) {
      smogRef.current.rotation.y -= delta * 0.15;
      smogRef.current.material.opacity = THREE.MathUtils.lerp(0.8, 0.0, normalizedShift);
    }
  });

  return (
    <group>
      {/* Background Environment - Fades from Grey/Red to Deep Space/Blue based on shift */}
      <color attach="background" args={[new THREE.Color().lerpColors(new THREE.Color('#1a1010'), new THREE.Color('#020813'), normalizedShift)]} />
      
      <ambientLight intensity={THREE.MathUtils.lerp(0.2, 0.6, normalizedShift)} />
      <directionalLight position={[10, 10, 5]} intensity={THREE.MathUtils.lerp(0.5, 1.5, normalizedShift)} color={new THREE.Color().lerpColors(new THREE.Color('#ff8866'), new THREE.Color('#ffffff'), normalizedShift)} />

      {/* Stars only visible when shifting towards sustainable */}
      <group visible={normalizedShift > 0.2}>
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      </group>

      <group ref={planetGroupRef}>
        {/* Planet Core Heartbeat */}
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1, 4]} />
          <meshStandardMaterial wireframe color="#ff2a00" emissive="#ff2a00" transparent opacity={0.8} />
        </mesh>

        {/* Smog Particles */}
        <points ref={smogRef}>
          <sphereGeometry args={[4.5, 32, 32]} />
          <pointsMaterial size={0.05} color="#554433" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
        </points>

        {/* Dynamic Foliage / Tech */}
        {foliage.map((item) => {
          // Delay growth based on item id so they don't all pop at once
          const threshold = (item.id / foliage.length) * 0.8;
          const growProgress = Math.max(0, Math.min(1, (normalizedShift - threshold) * 5));
          const scale = item.type === 'tree' ? growProgress * 0.15 : growProgress * 0.1;
          
          return (
            <mesh key={item.id} position={item.pos} scale={scale}>
              {item.type === 'tree' ? (
                <coneGeometry args={[1, 3, 4]} />
              ) : (
                <boxGeometry args={[2, 0.2, 2]} />
              )}
              <meshStandardMaterial color={item.type === 'tree' ? "#00ff66" : "#00ccff"} emissive={item.type === 'tree' ? "#003311" : "#0055ff"} emissiveIntensity={0.5} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
