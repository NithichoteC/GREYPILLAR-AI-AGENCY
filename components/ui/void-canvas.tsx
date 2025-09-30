"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Geometry, Base, Subtraction} from '@react-three/csg'
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { Bloom, N8AO, SMAA, EffectComposer } from '@react-three/postprocessing'
import { useRef } from "react";
import { Mesh } from "three";
import { KernelSize } from "postprocessing";

function Shape() {
  const meshRef = useRef<Mesh>(null);
  const innerSphereRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
      meshRef.current.rotation.z += delta * 0.2;
    }
    if (innerSphereRef.current) {
      innerSphereRef.current.rotation.x += delta * 0.3;
      innerSphereRef.current.rotation.y += delta * 0.5;
      innerSphereRef.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <>
      <mesh ref={meshRef}>
        <meshPhysicalMaterial
          roughness={0}
          metalness={0.95}
          clearcoat={1}
          clearcoatRoughness={0.1}
          color="#000000"
        />

        <Geometry>
          <Base>
            <primitive
              object={new RoundedBoxGeometry(2, 2, 2, 7, 0.2)}
            />
          </Base>

          <Subtraction>
            <sphereGeometry args={[1.25, 64, 64]} />
          </Subtraction>
        </Geometry>
      </mesh>

      <mesh ref={innerSphereRef}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          emissive={"white"}
          emissiveIntensity={1}
        />
      </mesh>
    </>
  );
}

function Environment() {
  return (
    <>
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.2}
        color="#e6f3ff"
      />

      <directionalLight
        position={[0, -5, 10]}
        intensity={0.4}
        color="#fff5e6"
      />

      <ambientLight intensity={0.8} color="#404040" />

      <pointLight
        position={[8, 3, 8]}
        intensity={0.2}
        color="#ffeecc"
        distance={20}
      />

      <pointLight
        position={[-8, 3, -8]}
        intensity={0.2}
        color="#ccf0ff"
        distance={20}
      />

      <directionalLight
        position={[0, -10, 0]}
        intensity={0.2}
        color="#f0f0f0"
      />
    </>
  );
}

interface VoidCanvasProps {
  className?: string;
}

export default function VoidCanvas({ className }: VoidCanvasProps) {
  return (
    <Canvas
      className={className || "w-full h-full"}
      camera={{ position: [5, 5, 5], fov: 50 }}
      dpr={[1, 1]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ maxWidth: '100vw', maxHeight: '100vh' }}
    >
      <Environment />
      <Shape />
      <EffectComposer multisampling={0}>
        <N8AO halfRes color="black" aoRadius={2} intensity={1} aoSamples={6} denoiseSamples={4} />
        <Bloom
          kernelSize={3}
          luminanceThreshold={0}
          luminanceSmoothing={0.4}
          intensity={1.2}
        />
        <Bloom
          kernelSize={KernelSize.LARGE}
          luminanceThreshold={0}
          luminanceSmoothing={0}
          intensity={0.8}
        />
        <Bloom
          kernelSize={KernelSize.HUGE}
          luminanceThreshold={0}
          luminanceSmoothing={0}
          intensity={0.5}
        />
        <SMAA />
      </EffectComposer>
    </Canvas>
  );
}