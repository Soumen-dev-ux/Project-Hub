export default function Lights() {
  return (
    <>
      {/* Very soft ambient — keep dark so emissive neon pops */}
      <ambientLight intensity={0.08} color="#080d20" />

      {/* Soft top-down directional with shadows */}
      <directionalLight
        position={[10, 25, 10]}
        intensity={0.35}
        color="#e8f0ff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={120}
        shadow-camera-left={-35}
        shadow-camera-right={35}
        shadow-camera-top={35}
        shadow-camera-bottom={-35}
      />

      {/* Cyan city fill — positioned high, moderate intensity */}
      <pointLight position={[0, 15, 0]} intensity={1.5} color="#00f5ff" distance={60} decay={2} />

      {/* Pink side accent */}
      <pointLight position={[-18, 10, -12]} intensity={2.5} color="#ff00aa" distance={45} decay={2} />

      {/* Purple side accent */}
      <pointLight position={[18, 10, 12]} intensity={2.5} color="#8800ff" distance={45} decay={2} />

      {/* Subtle ground bounce */}
      <pointLight position={[0, 0.5, 0]} intensity={0.6} color="#003344" distance={25} decay={3} />

      {/* Hemisphere for gentle sky/ground color bleed */}
      <hemisphereLight skyColor="#060d28" groundColor="#020408" intensity={0.35} />
    </>
  );
}
