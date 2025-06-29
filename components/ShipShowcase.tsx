import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import ThreeDBlackPearl from './ThreeDBlackPearl';

const ShipShowcase = () => {
  return (
    <div style={{ height: '500px', background: '#111' }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          <Stars />
          <ThreeDBlackPearl />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default ShipShowcase;
