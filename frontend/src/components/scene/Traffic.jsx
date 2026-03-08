import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

// Glowing light streaks moving along the X and Z axes
export default function Traffic() {
  const xStreaksRef = useRef();
  const zStreaksRef = useRef();

  useFrame((state, delta) => {
    if (xStreaksRef.current) {
      // Move streaks along X
      xStreaksRef.current.children.forEach((child) => {
        child.position.x += child.userData.speed * delta;
        if (child.userData.speed > 0 && child.position.x > 100) {
          child.position.x = -100;
        } else if (child.userData.speed < 0 && child.position.x < -100) {
          child.position.x = 100;
        }
      });
    }

    if (zStreaksRef.current) {
      // Move streaks along Z
      zStreaksRef.current.children.forEach((child) => {
        child.position.z += child.userData.speed * delta;
        if (child.userData.speed > 0 && child.position.z > 100) {
          child.position.z = -100;
        } else if (child.userData.speed < 0 && child.position.z < -100) {
          child.position.z = 100;
        }
      });
    }
  });

  // Generate random streaks
  const [{ xStreaks, zStreaks }] = useState(() => {
    const generateStreaks = (count, axis) => {
      const streaksData = [];
      for (let i = 0; i < count; i++) {
        const isPositive = Math.random() > 0.5;
        const speed = (Math.random() * 15 + 10) * (isPositive ? 1 : -1);

        let x = 0, y = 0.05, z = 0;
        let w = 0.1, d = 0.1;

        const color = Math.random() > 0.5 ? '#00f5ff' : '#ff00aa';

        if (axis === 'x') {
          // X-axis traffic
          x = (Math.random() - 0.5) * 200;
          // Align with Z road strips (approx at z = -4, 0, 4) or adjacent
          z = [-5, -4, -3, 3, 4, 5][Math.floor(Math.random() * 6)] + (Math.random() * 0.5 - 0.25);
          w = Math.random() * 3 + 1; // Length of the streak
          d = 0.1; // Width
        } else {
          // Z-axis traffic
          z = (Math.random() - 0.5) * 200;
          x = [-5, -4, -3, 3, 4, 5][Math.floor(Math.random() * 6)] + (Math.random() * 0.5 - 0.25);
          d = Math.random() * 3 + 1; // Length
          w = 0.1; // Width
        }

        streaksData.push({
          id: `${axis}-${i}`,
          x, y, z,
          speed,
          w, d,
          color
        });
      }
      return streaksData;
    };

    return {
      xStreaks: generateStreaks(40, 'x'),
      zStreaks: generateStreaks(40, 'z')
    };
  });

  return (
    <group>
      <group ref={xStreaksRef}>
        {xStreaks.map((s) => (
          <mesh key={s.id} position={[s.x, s.y, s.z]} userData={{ speed: s.speed }}>
            <boxGeometry args={[s.w, 0.01, s.d]} />
            <meshBasicMaterial color={s.color} />
          </mesh>
        ))}
      </group>
      <group ref={zStreaksRef}>
        {zStreaks.map((s) => (
          <mesh key={s.id} position={[s.x, s.y, s.z]} userData={{ speed: s.speed }}>
            <boxGeometry args={[s.w, 0.01, s.d]} />
            <meshBasicMaterial color={s.color} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
