import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3, MathUtils } from 'three';

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

  useFrame((state, delta) => {
    // Smooth damp toward target, independent of framerate
    const smoothFactor = 4;
    
    currentPos.current.x = MathUtils.damp(currentPos.current.x, targetPos.current.x, smoothFactor, delta);
    currentPos.current.y = MathUtils.damp(currentPos.current.y, targetPos.current.y, smoothFactor, delta);
    currentPos.current.z = MathUtils.damp(currentPos.current.z, targetPos.current.z, smoothFactor, delta);

    currentLookAt.current.x = MathUtils.damp(currentLookAt.current.x, targetLookAt.current.x, smoothFactor, delta);
    currentLookAt.current.y = MathUtils.damp(currentLookAt.current.y, targetLookAt.current.y, smoothFactor, delta);
    currentLookAt.current.z = MathUtils.damp(currentLookAt.current.z, targetLookAt.current.z, smoothFactor, delta);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
