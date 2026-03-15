import { Canvas } from '@react-three/fiber';
import { Suspense, useState } from 'react';
import { Stars, PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import Building from './Building';
import Ground from './Ground';
import Lights from './Lights';
import CameraRig from './CameraRig';
import Traffic from './Traffic';
import FlyingCars from './FlyingCars';

// Seeded particle positions so they don't change on re-render
const PARTICLES = Array.from({ length: 25 }, (_, i) => {
  const seed = i * 137.508;
  return {
    pos: [Math.sin(seed) * 22, ((seed * 7) % 12) + 2, Math.cos(seed * 2) * 22],
    color: i % 3 === 0 ? '#00f5ff' : i % 3 === 1 ? '#ff00aa' : '#9000ff',
  };
});

export default function CityScene({ projects, onBuildingClick, selectedProject, scrollProgress }) {
  const [dpr, setDpr] = useState(1);

  return (
    <Canvas
      className="r3f-canvas"
      shadows
      dpr={dpr}
      camera={{ position: [0, 8, 20], fov: 60, near: 0.1, far: 300 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      style={{ background: '#030712' }}
    >
      <PerformanceMonitor onChange={({ factor }) => setDpr(Math.min(1.5, Math.max(0.7, 1.5 * factor)))} />
      <color attach="background" args={['#030712']} />
      <fog attach="fog" args={['#030712', 35, 90]} />

      {/* Starfield background */}
      <Stars
        radius={100}
        depth={50}
        count={3000}
        factor={3}
        saturation={0}
        fade
        speed={0.3}
      />

      <Lights />
      <Ground />

      <CameraRig target={selectedProject} scrollProgress={scrollProgress} />

      <Suspense fallback={null}>
        {projects.map((project) => (
          <Building
            key={project._id}
            project={project}
            onClick={onBuildingClick}
            isSelected={selectedProject?._id === project._id}
          />
        ))}
      </Suspense>

      {/* Floating neon particles */}
      {PARTICLES.map((p, i) => (
        <mesh key={`p-${i}`} position={p.pos}>
          <sphereGeometry args={[0.045, 3, 3]} />
          <meshBasicMaterial color={p.color} />
        </mesh>
      ))}

      <Traffic />
      <FlyingCars />

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.4} mipmapBlur intensity={0.8} />
      </EffectComposer>
    </Canvas>
  );
}
