import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sparkles, Icosahedron, Box, TorusKnot } from '@react-three/drei';
import * as THREE from 'three';

export default function LabScene({ stage }) {
  const { camera } = useThree();
  const groupRef = useRef();
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Different rotation speeds based on stage
      const speed = stage === 'analyzing' ? 2 : stage === 'fusion' ? 5 : 0.5;
      groupRef.current.rotation.y += delta * speed;
      groupRef.current.rotation.x += delta * (speed * 0.5);
    }
    
    // Camera movement based on stage
    if (stage === 'launch') {
      // Zoom out to reveal earth
      camera.position.lerp(new THREE.Vector3(0, 5, 20), 0.01);
    } else if (stage === 'hologram') {
      // Close up on the startup
      camera.position.lerp(new THREE.Vector3(0, 0, 5), 0.05);
    } else {
      // Default reactor view
      camera.position.lerp(new THREE.Vector3(0, 1, 8), 0.05);
    }
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={2} color="#00ffcc" />
      <pointLight position={[0, 0, 0]} intensity={stage === 'fusion' ? 10 : 2} color="#00ffff" distance={20} />

      <group ref={groupRef} position={[0, 0, 0]}>
        
        {/* Stage: Analyzing (Scanning Ring) */}
        {(stage === 'input' || stage === 'analyzing') && (
          <TorusKnot args={[1.5, 0.05, 128, 16]} scale={stage === 'analyzing' ? 1.5 : 1}>
            <meshPhongMaterial color="#00ffcc" emissive="#00aa88" emissiveIntensity={stage === 'analyzing' ? 2 : 0.5} wireframe transparent opacity={0.5} />
          </TorusKnot>
        )}

        {/* Stage: Fusion (Colliding Modules) */}
        {stage === 'fusion' && (
          <>
            <Box args={[1, 1, 1]} position={[-2, 1, 0]}>
              <meshBasicMaterial color="#ff00ff" wireframe />
            </Box>
            <Box args={[1, 1, 1]} position={[2, -1, 0]}>
              <meshBasicMaterial color="#ffff00" wireframe />
            </Box>
            <Box args={[1, 1, 1]} position={[0, 2, -2]}>
              <meshBasicMaterial color="#00ff00" wireframe />
            </Box>
          </>
        )}

        {/* Stage: Hologram & Launch (The Startup Core) */}
        {(stage === 'hologram' || stage === 'launch') && (
          <Icosahedron args={[2, 1]}>
            <meshPhongMaterial color="#ffffff" emissive="#00aaff" emissiveIntensity={1} wireframe transparent opacity={0.8} />
          </Icosahedron>
        )}

        {/* Particles */}
        <Sparkles 
          count={stage === 'launch' ? 2000 : 500} 
          scale={stage === 'launch' ? 20 : 8} 
          size={stage === 'launch' ? 3 : 2} 
          color="#00ffff" 
          speed={stage === 'fusion' ? 4 : 1} 
        />
      </group>
    </>
  );
}
