import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

// Animated grid ref for subtle pulse and tech-metro scrolling
function AnimatedGrid() {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      // Pulse opacity
      ref.current.material.opacity =
        0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.08;
    }
  });
  return (
    <gridHelper
      ref={ref}
      args={[200, 80, '#00f5ff', '#00f5ff']}
      position={[0, 0.01, 0]}
    />
  );
}

export default function Ground() {
  return (
    <group>
      {/* Dark metallic ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial
          color="#020408"
          metalness={0.98}
          roughness={0.05}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Animated cyan grid */}
      <AnimatedGrid />
      {/* Static pink sub-grid */}
      <gridHelper args={[200, 40, '#ff00aa', '#ff00aa']} position={[0, 0.005, 0]} material-opacity={0.05} material-transparent />

      {/* Subtle road strips — X axis */}
      {[-4, 0, 4].map((x, i) => (
        <mesh key={`rx-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.015, 0]}>
          <planeGeometry args={[0.12, 200]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.1} />
        </mesh>
      ))}
      {/* Subtle road strips — Z axis */}
      {[-4, 0, 4].map((z, i) => (
        <mesh key={`rz-${i}`} rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.015, z]}>
          <planeGeometry args={[0.12, 200]} />
          <meshBasicMaterial color="#ff00aa" transparent opacity={0.08} />
        </mesh>
      ))}
    </group>
  );
}
