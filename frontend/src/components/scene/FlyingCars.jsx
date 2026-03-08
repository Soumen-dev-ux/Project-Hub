import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function FlyingCars() {
  const carsRef = useRef();

  // Generate initial flying cars
  const carData = Array.from({ length: 15 }, (_, i) => {
    // Random height between 3 and 15
    const y = Math.random() * 12 + 3;
    const isX = Math.random() > 0.5;

    // Choose start position and speed
    const isPositive = Math.random() > 0.5;
    const speed = (Math.random() * 5 + 3) * (isPositive ? 1 : -1);

    let x, z;
    if (isX) {
      x = (Math.random() - 0.5) * 100;
      z = (Math.random() - 0.5) * 60;
    } else {
      z = (Math.random() - 0.5) * 100;
      x = (Math.random() - 0.5) * 60;
    }

    const color = Math.random() > 0.6 ? '#00f5ff' : (Math.random() > 0.5 ? '#ff00aa' : '#ffffff');

    return {
      id: i,
      x, y, z,
      speed,
      isX,
      color,
      offset: Math.random() * Math.PI * 2, // For subtle bobbing
    };
  });

  useFrame((state, delta) => {
    if (!carsRef.current) return;
    const t = state.clock.elapsedTime;

    carsRef.current.children.forEach((carGroup, i) => {
      const data = carData[i];
      if (data.isX) {
        carGroup.position.x += data.speed * delta;
        if (data.speed > 0 && carGroup.position.x > 60) carGroup.position.x = -60;
        if (data.speed < 0 && carGroup.position.x < -60) carGroup.position.x = 60;
      } else {
        carGroup.position.z += data.speed * delta;
        if (data.speed > 0 && carGroup.position.z > 60) carGroup.position.z = -60;
        if (data.speed < 0 && carGroup.position.z < -60) carGroup.position.z = 60;
      }

      // Add slight vertical bobbing
      carGroup.position.y = data.y + Math.sin(t * 2 + data.offset) * 0.2;
    });
  });

  return (
    <group ref={carsRef}>
      {carData.map((data) => (
        <group key={data.id} position={[data.x, data.y, data.z]}>
          <mesh>
            <boxGeometry args={data.isX ? [1.0, 0.16, 0.32] : [0.32, 0.16, 1.0]} />
            <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Highlight / tail light emissive part */}
          <mesh position={data.isX ? (data.speed > 0 ? [-0.4, 0, 0] : [0.4, 0, 0]) : (data.speed > 0 ? [0, 0, -0.4] : [0, 0, 0.4])}>
            <boxGeometry args={data.isX ? [0.25, 0.2, 0.3] : [0.3, 0.2, 0.25]} />
            <meshBasicMaterial color={data.color} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
