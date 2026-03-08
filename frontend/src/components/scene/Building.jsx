import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Color, BoxGeometry, EdgesGeometry, CanvasTexture, RepeatWrapping } from 'three';

// Generate a procedural glass skyscraper window texture
const WINDOW_TEX = (() => {
  if (typeof document === 'undefined') return null; // safety for SSR/tests
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Base dark glass
  ctx.fillStyle = '#02040a';
  ctx.fillRect(0, 0, 256, 256);

  // Draw grid of windows
  for (let y = 0; y < 256; y += 16) {
    for (let x = 0; x < 256; x += 16) {
      // 25% chance a window is lit
      if (Math.random() > 0.75) {
        ctx.fillStyle = '#ffffff'; // pure white for emissive map
        ctx.fillRect(x + 2, y + 2, 12, 10);
      } else {
        ctx.fillStyle = '#081220'; // unlit reflection
        ctx.fillRect(x + 2, y + 2, 12, 10);
      }
    }
  }

  const tex = new CanvasTexture(canvas);
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  return tex;
})();

// Distinct cyberpunk building palettes
// base: very dark so emissive glows through clearly; emissive: neon accent
const BUILDING_PALETTES = [
  { base: '#050d1a', emissive: '#00f5ff', label: 'cyan' },  // neon cyan
  { base: '#1a0510', emissive: '#ff00aa', label: 'pink' },  // neon pink
  { base: '#0d0520', emissive: '#9000ff', label: 'purple' },  // neon purple
  { base: '#051a0d', emissive: '#00ff88', label: 'green' },  // neon green
  { base: '#1a0a00', emissive: '#ff6b35', label: 'orange' },  // neon orange
];

export default function Building({ project, onClick, isSelected }) {
  const animGroupRef = useRef();
  const materialRef = useRef();
  const edgesMatRef = useRef();
  const glowRef = useRef();
  const [hovered, setHovered] = useState(false);

  const palIndex = Math.abs(project.title.charCodeAt(0)) % BUILDING_PALETTES.length;
  const palette = BUILDING_PALETTES[palIndex];

  const stackCount = project.techStack?.length || 3;
  const height = 1.8 + stackCount * 0.45;
  const width = 0.75 + (stackCount % 3) * 0.25;
  const depth = 0.75 + ((stackCount + 1) % 3) * 0.25;

  const pos = project.position;
  const emissiveCol = useMemo(() => new Color(palette.emissive), [palette.emissive]);

  // Procedural architecture styles based on title
  const styleType = Math.abs(project.title.charCodeAt(project.title.length - 1) || 0) % 4;

  const parts = useMemo(() => {
    const pList = [];
    if (styleType === 1) {
      // Stepped skyscraper (3 tiers)
      pList.push({ w: width, h: height * 0.5, d: depth, y: height * 0.25, x: 0, z: 0 });
      pList.push({ w: width * 0.75, h: height * 0.3, d: depth * 0.75, y: height * 0.65, x: 0, z: 0 });
      pList.push({ w: width * 0.4, h: height * 0.2, d: depth * 0.4, y: height * 0.9, x: 0, z: 0 });
    } else if (styleType === 2) {
      // Twin towers on a base
      const tw = width * 0.35;
      pList.push({ w: width, h: height * 0.15, d: depth, y: height * 0.075, x: 0, z: 0 });
      pList.push({ w: tw, h: height * 0.85, d: depth * 0.8, y: height * 0.575, x: -width * 0.25, z: 0 });
      pList.push({ w: tw, h: height * 0.85, d: depth * 0.8, y: height * 0.575, x: width * 0.25, z: 0 });
    } else if (styleType === 3) {
      // L-shaped building
      pList.push({ w: width * 0.45, h: height, d: depth, y: height * 0.5, x: -width * 0.25, z: 0 });
      pList.push({ w: width * 0.55, h: height * 0.35, d: depth * 0.55, y: height * 0.175, x: width * 0.25, z: depth * 0.2 });
    } else {
      // Standard block
      pList.push({ w: width, h: height, d: depth, y: height * 0.5, x: 0, z: 0 });
    }
    return pList;
  }, [width, height, depth, styleType]);

  const edgesGeoList = useMemo(() => {
    return parts.map((p) => {
      const box = new BoxGeometry(p.w, p.h, p.d);
      const edges = new EdgesGeometry(box);
      box.dispose();
      return edges;
    });
  }, [parts]);

  useFrame((state) => {
    if (!animGroupRef.current) return;
    const t = state.clock.elapsedTime;

    // Gentle, slow vertical bob for the entire group
    animGroupRef.current.position.y = Math.sin(t * 0.6 + palIndex * 1.4) * 0.05;

    // Smooth emissive intensity lerp on shared material
    if (materialRef.current) {
      const targetIntensity = isSelected ? 4.0 : hovered ? 2.0 : 0.8;
      materialRef.current.emissiveIntensity +=
        (targetIntensity - materialRef.current.emissiveIntensity) * 0.07;
    }

    // Edge wire opacity
    if (edgesMatRef.current) {
      const targetOp = hovered || isSelected ? 1.0 : 0.35;
      edgesMatRef.current.opacity +=
        (targetOp - edgesMatRef.current.opacity) * 0.1;
    }

    // Glow ring + slow spin
    if (glowRef.current?.material) {
      const targetOp = hovered || isSelected ? 0.55 : 0.0;
      glowRef.current.material.opacity +=
        (targetOp - glowRef.current.material.opacity) * 0.1;
      glowRef.current.rotation.z += 0.012;
    }
  });

  const active = hovered || isSelected;
  const ringR = Math.max(width, depth) * 1.2;

  return (
    <group
      position={[pos.x, 0, pos.z]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(project);
      }}
    >
      <group ref={animGroupRef}>
        {/* Shared Materials */}
        <meshStandardMaterial
          ref={materialRef}
          color={palette.base}
          emissive={emissiveCol}
          emissiveIntensity={0.8}
          emissiveMap={WINDOW_TEX}
          map={WINDOW_TEX}
          metalness={0.85}
          roughness={0.15}
        />
        <lineBasicMaterial
          ref={edgesMatRef}
          color={palette.emissive}
          transparent
          opacity={0.35}
        />

        {/* ── Composed building parts ───────────────────────────────── */}
        {parts.map((p, idx) => (
          <group key={idx} position={[p.x, p.y, p.z]}>
            <mesh castShadow receiveShadow material={materialRef.current}>
              <boxGeometry args={[p.w, p.h, p.d]} />
            </mesh>
            <lineSegments geometry={edgesGeoList[idx]} material={edgesMatRef.current} />
          </group>
        ))}

        {/* ── Glow ring at base ────────────────────────────────── */}
        <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[ringR * 0.7, ringR * 1.55, 32]} />
          <meshBasicMaterial color={palette.emissive} transparent opacity={0} />
        </mesh>

        {/* ── Hologram detail ring ─────────────────────────────── */}
        <mesh position={[0, height * 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.max(width, depth) * 1.2, Math.max(width, depth) * 1.25, 32]} />
          <meshBasicMaterial color={palette.emissive} transparent opacity={0.2} side={2} />
        </mesh>

        {/* ── Rooftop accent light ─────────────────────────────── */}
        {active && (
          <pointLight
            position={[0, height + 0.8, 0]}
            color={palette.emissive}
            intensity={4}
            distance={9}
            decay={2}
          />
        )}

        {/* ── Floating project-name label ──────────────────────── */}
        <Html
          position={[0, height + 0.6, 0]}
          center distanceFactor={12} occlude
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            padding: '3px 10px', borderRadius: 6,
            background: active ? `${palette.emissive}22` : 'rgba(3,7,18,0.7)',
            border: `1px solid ${palette.emissive}${active ? '88' : '33'}`,
            color: active ? palette.emissive : 'rgba(226,232,240,0.5)',
            fontSize: 11, fontFamily: 'Orbitron, sans-serif',
            fontWeight: 600, letterSpacing: '0.08em', whiteSpace: 'nowrap',
            backdropFilter: 'blur(4px)', transition: 'all 0.2s',
            boxShadow: active ? `0 0 12px ${palette.emissive}44` : 'none',
          }}>
            {project.title}
          </div>
        </Html>
      </group>
    </group>
  );
}
