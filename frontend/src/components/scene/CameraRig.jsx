import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

export default function CameraRig({ target, scrollProgress }) {
  const { camera } = useThree();
  const currentPos = useRef(new Vector3(0, 8, 20));
  const currentLookAt = useRef(new Vector3(0, 0, 0));
  const targetPos = useRef(new Vector3(0, 8, 20));
  const targetLookAt = useRef(new Vector3(0, 0, 0));

  // When a project is selected, fly camera to it
  useEffect(() => {
    if (target) {
      const pos = target.position;
      targetPos.current.set(pos.x + 3, pos.y + 4, pos.z + 6);
      targetLookAt.current.set(pos.x, pos.y + 1.5, pos.z);
    } else {
      // Return to default overview
      const scrollZ = -scrollProgress * 20;
      targetPos.current.set(0, 8, 20 + scrollZ);
      targetLookAt.current.set(0, 0, scrollZ);
    }
  }, [target, scrollProgress]);

  // Scroll-based camera drift when no building selected
  useEffect(() => {
    if (!target) {
      const scrollZ = -scrollProgress * 20;
      targetPos.current.set(0, 8, 20 + scrollZ);
      targetLookAt.current.set(0, 0, scrollZ);
    }
  }, [scrollProgress, target]);

  useFrame(() => {
    // Smooth lerp toward target
    currentPos.current.lerp(targetPos.current, 0.04);
    currentLookAt.current.lerp(targetLookAt.current, 0.04);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
