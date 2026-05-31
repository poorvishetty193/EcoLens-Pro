import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere, Html } from '@react-three/drei';
import GlassCard from '../shared/GlassCard';

function Earth() {
  const earthRef = useRef();
  
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={earthRef}>
      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial 
          color="#00e676" 
          wireframe={true} 
          transparent={true} 
          opacity={0.3} 
        />
      </Sphere>
      <Sphere args={[1.98, 32, 32]}>
        <meshBasicMaterial color="#050f0a" />
      </Sphere>

      <mesh position={[1.4, 0.8, 1.1]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#ffab40" />
        <Html distanceFactor={10} zIndexRange={[100, 0]}>
          <div className="bg-[rgba(0,0,0,0.8)] backdrop-blur-md px-2 py-1 rounded text-xs text-white whitespace-nowrap border border-[rgba(255,171,64,0.3)]">
            You <span className="text-accent-amber font-bold ml-1">475g/kWh</span>
          </div>
        </Html>
      </mesh>
    </group>
  );
}

export default function EarthGlobe() {
  return (
    <GlassCard title="Live Planetary View" className="h-[824px] flex flex-col p-0 overflow-hidden" accentColor="var(--accent-green)">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-primary pointer-events-none z-10 opacity-60"></div>
      
      <div className="w-full h-full absolute inset-0 pt-16 cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00e676" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#1de9b6" />
          
          <Earth />
          
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate={false} 
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </div>

      <div className="absolute bottom-6 left-6 right-6 z-20">
         <div className="bg-[rgba(0,0,0,0.5)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] p-4 rounded-xl flex items-center justify-between">
            <div>
               <div className="text-xs text-text-secondary uppercase">Local Time</div>
               <div className="font-heading text-lg font-bold">14:30 PM</div>
            </div>
            <div className="text-right">
               <div className="text-xs text-text-secondary uppercase">Status</div>
               <div className="font-heading text-lg font-bold text-accent-green flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></span>
                 Optimal
               </div>
            </div>
         </div>
      </div>
    </GlassCard>
  );
}
