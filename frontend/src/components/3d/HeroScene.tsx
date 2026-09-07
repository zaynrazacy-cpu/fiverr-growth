import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const GlowingCore = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.8, 1]} />
        <MeshDistortMaterial
          color="#10b981"
          emissive="#064e3b"
          roughness={0.2}
          metalness={0.8}
          distort={0.35}
          speed={2}
          wireframe={true}
        />
      </mesh>
      {/* Inner glowing sphere */}
      <mesh>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#0891b2"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
    </Float>
  );
};

export const HeroScene: React.FC = () => {
  return (
    <div className="w-full h-72 md:h-80 relative overflow-hidden rounded-2xl border border-emerald-500/20 glass-panel shadow-2xl shadow-emerald-950/30">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/20 via-transparent to-cyan-950/20 pointer-events-none z-10" />
      
      <div className="absolute top-4 left-6 z-20 pointer-events-none">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Autonomous Freelancer Intelligence Active
        </span>
        <h2 className="text-2xl md:text-3xl font-bold mt-2 text-white">
          FiverrGrowth <span className="text-emerald-400">Copilot</span>
        </h2>
        <p className="text-xs md:text-sm text-gray-400 max-w-sm mt-1">
          Algorithmic Gig SEO, automated Buyer Brief proposals & instant market intelligence.
        </p>
      </div>

      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#10b981" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#06b6d4" />
        <GlowingCore />
      </Canvas>
    </div>
  );
};
