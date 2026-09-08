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

export const AmbientBackdrop: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-25">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#10b981" />
        <directionalLight position={[-10, -10, -5]} intensity={0.8} color="#06b6d4" />
        <GlowingCore />
      </Canvas>
    </div>
  );
};

export const HeroScene: React.FC = () => {
  return (
    <div className="w-full h-44 md:h-48 relative overflow-hidden rounded-2xl border border-emerald-500/20 glass-panel shadow-xl shadow-emerald-950/20">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/70 to-transparent pointer-events-none z-10 p-5 flex flex-col justify-center">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Neural Market Intelligence Core
        </span>
        <h3 className="text-lg md:text-xl font-extrabold mt-1 text-white">
          FiverrGrowth <span className="text-emerald-400">Algorithmic Engine</span>
        </h3>
        <p className="text-[11px] text-gray-400 max-w-sm mt-0.5">
          Real-time buyer query harvesting, competitive gap radar & continuous brief matching.
        </p>
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-1/2 md:w-2/5">
        <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#10b981" />
          <directionalLight position={[-10, -10, -5]} intensity={1} color="#06b6d4" />
          <GlowingCore />
        </Canvas>
      </div>
    </div>
  );
};

