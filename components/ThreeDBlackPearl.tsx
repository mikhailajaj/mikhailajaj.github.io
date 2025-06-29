import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

// A simple, stylized representation of a pirate ship
const ThreeDBlackPearl = () => {
  const groupRef = useRef<Group>(null);

  // Gentle rocking animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.7) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Hull of the ship */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[1.5, 0.5, 4]} />
        <meshStandardMaterial color="#4a2c2a" />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[1.7, 0.3, 3.5]} />
        <meshStandardMaterial color="#5a3c3a" />
      </mesh>

      {/* Main Mast */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 4]} />
        <meshStandardMaterial color="#6b4c4a" />
      </mesh>

      {/* Sails */}
      <mesh position={[0, 2.5, -0.1]} rotation={[0, 0, -0.05]}>
        <planeGeometry args={[1.8, 2.5]} />
        <meshStandardMaterial color="#f0e6d2" side={2} />
      </mesh>
      <mesh position={[0, 0.8, -0.1]} rotation={[0, 0, -0.05]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshStandardMaterial color="#f0e6d2" side={2} />
      </mesh>

      {/* Fore Mast */}
      <mesh position={[0, 1, 1.5]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 3]} />
        <meshStandardMaterial color="#6b4c4a" />
      </mesh>
      <mesh position={[0, 1.8, 1.4]} rotation={[0.3, 0, 0]}>
        <planeGeometry args={[1.2, 1.8]} />
        <meshStandardMaterial color="#f0e6d2" side={2} />
      </mesh>

      {/* Cabin */}
      <mesh position={[0, 0.2, -1.5]}>
        <boxGeometry args={[1.2, 0.8, 1]} />
        <meshStandardMaterial color="#5a3c3a" />
      </mesh>
    </group>
  );
};

export default ThreeDBlackPearl;
