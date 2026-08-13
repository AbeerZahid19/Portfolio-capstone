"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const COLORS = ["#6366f1", "#22c55e", "#ef4444", "#f59e0b", "#0ea5e9"];

function Product() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [colorIndex, setColorIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  useFrame((_, delta) => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  function handleClick() {
     setColorIndex((i) => (i + 1) % COLORS.length);
  }

  return (
    <mesh
      ref={meshRef}
      onClick={handleClick}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      <torusKnotGeometry args={[1, 0.35, 128, 32]} />
      <meshStandardMaterial color={COLORS[colorIndex]} metalness={0.4} roughness={0.3} />
    </mesh>
  );
}

export function ProductViewer() {
  return (
    <div className="w-full h-[420px] rounded-lg border overflow-hidden bg-gray-950">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 3]} intensity={1} />
        <Product />
        
        <OrbitControls enablePan={false} minDistance={3} maxDistance={7} />
      </Canvas>
    </div>
  );
}