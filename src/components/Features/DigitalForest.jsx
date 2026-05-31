import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Instance, Instances } from '@react-three/drei';
import { useSimulation } from '../../context/SimulationContext';

// Simple Tree component to be instanced
const TreeModel = () => {
  return (
    <group>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
        <meshStandardMaterial color="#3d2817" />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[0.8, 1.5, 8]} />
        <meshStandardMaterial color="#1e5e2e" />
      </mesh>
    </group>
  );
};

export default function DigitalForest() {
  const { healthScore, completedQuests } = useSimulation();

  // Procedurally generate trees based on health score and quests
  const treeData = useMemo(() => {
    const trees = [];
    // Base trees + extra for health/quests
    const numTrees = Math.floor(healthScore / 2) + (completedQuests.length * 10);
    
    for (let i = 0; i < numTrees; i++) {
      // Scatter trees in a circle
      const radius = 1 + Math.random() * 8;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      // Random scale between 0.5 and 1.5
      const scale = 0.5 + Math.random();
      
      trees.push({ position: [x, 0, z], scale });
    }
    return trees;
  }, [healthScore, completedQuests]);

  return (
    <div className="w-full h-full min-h-[600px] my-12 relative rounded-3xl overflow-hidden border border-border-subtle shadow-2xl glass-panel">
      <div className="absolute top-8 left-8 z-10 pointer-events-none">
        <h2 className="text-4xl font-heading font-bold text-white glow-text mb-2">Your Digital Forest</h2>
        <p className="text-text-secondary text-lg">A living ecosystem reflecting your sustainability choices.</p>
        <div className="mt-4 px-4 py-2 bg-black/50 backdrop-blur-md rounded-xl inline-block border border-white/10">
          <span className="text-accent-green font-bold">{treeData.length}</span> Trees Growing
        </div>
      </div>

      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#fff1e0" castShadow />
          
          {/* Ground */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color={healthScore > 50 ? "#2d4c1e" : "#4a3c27"} />
          </mesh>

          {/* Real meshes since count is max ~100 to support multi-geometry tree easily without complex instancing */}
          {treeData.map((data, i) => (
            <group key={i} position={data.position} scale={data.scale}>
              <mesh position={[0, 0.5, 0]} castShadow>
                <cylinderGeometry args={[0.1, 0.2, 1, 8]} />
                <meshStandardMaterial color="#3d2817" />
              </mesh>
              <mesh position={[0, 1.5, 0]} castShadow>
                <coneGeometry args={[0.8, 2, 7]} />
                <meshStandardMaterial color={healthScore > 70 ? "#1de9b6" : "#2d8a4e"} />
              </mesh>
            </group>
          ))}

          <OrbitControls 
            enableZoom={true} 
            maxPolarAngle={Math.PI / 2 - 0.05} // don't go below ground
            minDistance={2}
            maxDistance={20}
          />
          <Environment preset="sunset" />
        </Canvas>
      </div>
    </div>
  );
}
