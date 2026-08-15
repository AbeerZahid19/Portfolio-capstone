"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  // Pass the raw plane coordinates straight through to the fragment shader.
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  varying vec2 vUv;

  void main() {
    // Normalize coordinates so the pattern doesn't stretch on wide screens.
    vec2 uv = vUv;
    uv.x *= u_resolution.x / u_resolution.y;

    // Distance from the cursor - used to bend the wave pattern toward the mouse
    // and to add a soft glow near the pointer.
    vec2 mouseUv = u_mouse;
    mouseUv.x *= u_resolution.x / u_resolution.y;
    float mouseDist = distance(uv, mouseUv);
    float mouseInfluence = smoothstep(0.6, 0.0, mouseDist) * 0.6;
    float mouseGlow = smoothstep(0.35, 0.0, mouseDist) * 0.4;

    // Layered sine waves drifting over time, nudged by how close the cursor is.
    float wave1 = sin((uv.x * 3.0 + u_time * 0.4) + mouseInfluence) * 0.5 + 0.5;
    float wave2 = sin((uv.y * 4.0 - u_time * 0.3) + mouseInfluence) * 0.5 + 0.5;
    float pattern = (wave1 + wave2) * 0.5;

    // Map the wave pattern onto a two-color gradient (deep indigo to violet).
    vec3 colorA = vec3(0.05, 0.05, 0.20);
    vec3 colorB = vec3(0.45, 0.25, 0.75);
    vec3 color = mix(colorA, colorB, pattern);

    // Add a visible glow around the cursor position.
    color += vec3(0.6, 0.4, 0.9) * mouseGlow;

    // Cheap film-grain style noise so the gradient doesn't look perfectly flat.
    float grain = fract(sin(dot(uv * u_time, vec2(12.9898, 78.233))) * 43758.5453);
    color += (grain - 0.5) * 0.03;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// Shared mutable mouse position, updated directly from a window listener so we
// don't depend on R3F's raycasting hitting the plane exactly.
const mouseState = { x: 0.5, y: 0.5 };

function ShaderPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  const hidden = useRef(false);

  useEffect(() => {
    function handleVisibility() {
      hidden.current = document.hidden;
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useFrame((state) => {
    if (hidden.current || !materialRef.current) return; // pause when tab is hidden
    materialRef.current.uniforms.u_time.value = state.clock.elapsedTime;
    materialRef.current.uniforms.u_mouse.value.set(mouseState.x, mouseState.y);
    materialRef.current.uniforms.u_resolution.value.set(size.width, size.height);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          u_time: { value: 0 },
          u_resolution: { value: new THREE.Vector2(1, 1) },
          u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
        }}
      />
    </mesh>
  );
}

export function ShaderHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      mouseState.x = (e.clientX - rect.left) / rect.width;
      // Flip Y since screen coordinates go top-to-bottom, UV goes bottom-to-top.
      mouseState.y = 1 - (e.clientY - rect.top) / rect.height;
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full">
      <Canvas
        orthographic
        camera={{ zoom: 1, position: [0, 0, 1] }}
        dpr={[1, 1.5]}
        className="w-full h-full"
      >
        <ShaderPlane />
      </Canvas>
    </div>
  );
}