"use client";

import React, { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Stats,
} from "@react-three/drei";
import { ErrorBoundary } from "react-error-boundary";
import * as THREE from "three";

// Extend Three.js objects for React Three Fiber
extend({
  AmbientLight: THREE.AmbientLight,
  DirectionalLight: THREE.DirectionalLight,
  PointLight: THREE.PointLight,
});

interface Scene3DConfig {
  camera: {
    position: [number, number, number];
    fov: number;
    near: number;
    far: number;
  };
  lighting: {
    ambient: { color: string; intensity: number };
    directional: {
      color: string;
      intensity: number;
      position: [number, number, number];
    };
    point?: {
      color: string;
      intensity: number;
      position: [number, number, number];
    };
  };
  controls: {
    enableZoom: boolean;
    enablePan: boolean;
    enableRotate: boolean;
    autoRotate: boolean;
    autoRotateSpeed: number;
    maxPolarAngle: number;
    minDistance: number;
    maxDistance: number;
  };
  performance: {
    antialias: boolean;
    shadows: boolean;
    pixelRatio: number;
    powerPreference: "default" | "high-performance" | "low-power";
  };
  accessibility: {
    enableKeyboardControls: boolean;
    enableScreenReader: boolean;
    alternativeDescription: string;
  };
}

interface Scene3DBaseProps {
  children: React.ReactNode;
  config?: Partial<Scene3DConfig>;
  fallback2D?: React.ReactNode;
  className?: string;
  onSceneReady?: () => void;
  enableStats?: boolean;
}

// Device capability detection
const detectDeviceCapabilities = () => {
  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  if (!gl || !(gl instanceof WebGLRenderingContext)) {
    return { webgl: false, performance: "low" };
  }

  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = debugInfo
    ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    : "";

  // Simple performance heuristic
  const isMobile =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  const isLowEnd =
    isMobile || renderer.includes("Intel") || renderer.includes("Mali");

  return {
    webgl: true,
    performance: isLowEnd ? "low" : "high",
    renderer,
    isMobile,
  };
};

// Default configuration
const defaultConfig: Scene3DConfig = {
  camera: {
    position: [10, 10, 10],
    fov: 75,
    near: 0.1,
    far: 1000,
  },
  lighting: {
    ambient: { color: "#404040", intensity: 0.4 },
    directional: { color: "#ffffff", intensity: 1, position: [10, 10, 5] },
  },
  controls: {
    enableZoom: true,
    enablePan: true,
    enableRotate: true,
    autoRotate: false,
    autoRotateSpeed: 2,
    maxPolarAngle: Math.PI,
    minDistance: 5,
    maxDistance: 50,
  },
  performance: {
    antialias: true,
    shadows: true,
    pixelRatio: 1,
    powerPreference: "default",
  },
  accessibility: {
    enableKeyboardControls: true,
    enableScreenReader: true,
    alternativeDescription: "3D visualization scene",
  },
};

// Lighting component
const SceneLighting: React.FC<{ config: Scene3DConfig["lighting"] }> = ({
  config,
}) => {
  return (
    <>
      {/* @ts-ignore */}
      <ambientLight args={[config.ambient.color, config.ambient.intensity]} />
      {/* @ts-ignore */}
      <directionalLight
        args={[config.directional.color, config.directional.intensity]}
        position={config.directional.position}
        castShadow
      />
      {config.point && (
        /* @ts-ignore */
        <pointLight
          args={[config.point.color, config.point.intensity]}
          position={config.point.position}
          castShadow
        />
      )}
    </>
  );
};

// Performance monitor component
const PerformanceMonitor: React.FC<{
  onPerformanceChange?: (fps: number) => void;
}> = ({ onPerformanceChange }) => {
  const { gl } = useThree();
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useFrame(() => {
    frameCount.current++;
    const currentTime = performance.now();

    if (currentTime - lastTime.current >= 1000) {
      const fps =
        (frameCount.current * 1000) / (currentTime - lastTime.current);
      onPerformanceChange?.(fps);
      frameCount.current = 0;
      lastTime.current = currentTime;
    }
  });

  return null;
};

// Keyboard controls component
const KeyboardControls: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  const { camera } = useThree();

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const speed = 0.5;
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          camera.position.z -= speed;
          break;
        case "ArrowDown":
        case "KeyS":
          camera.position.z += speed;
          break;
        case "ArrowLeft":
        case "KeyA":
          camera.position.x -= speed;
          break;
        case "ArrowRight":
        case "KeyD":
          camera.position.x += speed;
          break;
        case "KeyQ":
          camera.position.y += speed;
          break;
        case "KeyE":
          camera.position.y -= speed;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, camera]);

  return null;
};

// Error fallback component
const ErrorFallback: React.FC<{
  error: Error;
  resetErrorBoundary: () => void;
}> = ({ error, resetErrorBoundary }) => (
  <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg border border-gray-700">
    <div className="text-center p-6">
      <div className="text-red-400 mb-4">
        <svg
          className="w-12 h-12 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">3D Scene Error</h3>
      <p className="text-gray-300 text-sm mb-4">
        Failed to load 3D visualization
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);

// Loading component
const SceneLoading: React.FC = () => (
  <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg border border-gray-700">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
      <p className="text-gray-300">Loading 3D Scene...</p>
    </div>
  </div>
);

// Main Scene3DBase component
const Scene3DBase: React.FC<Scene3DBaseProps> = ({
  children,
  config: userConfig,
  fallback2D,
  className = "",
  onSceneReady,
  enableStats = false,
}) => {
  const [deviceCapabilities, setDeviceCapabilities] = useState<ReturnType<
    typeof detectDeviceCapabilities
  > | null>(null);
  const [currentFPS, setCurrentFPS] = useState<number>(60);
  const [showFallback, setShowFallback] = useState(false);

  // Merge user config with defaults
  const config: Scene3DConfig = {
    ...defaultConfig,
    ...userConfig,
    camera: { ...defaultConfig.camera, ...userConfig?.camera },
    lighting: { ...defaultConfig.lighting, ...userConfig?.lighting },
    controls: { ...defaultConfig.controls, ...userConfig?.controls },
    performance: { ...defaultConfig.performance, ...userConfig?.performance },
    accessibility: {
      ...defaultConfig.accessibility,
      ...userConfig?.accessibility,
    },
  };

  useEffect(() => {
    const capabilities = detectDeviceCapabilities();
    setDeviceCapabilities(capabilities);

    // Show fallback for very low-end devices
    if (
      !capabilities.webgl ||
      (capabilities.performance === "low" && capabilities.isMobile)
    ) {
      setShowFallback(true);
    }
  }, []);

  useEffect(() => {
    // Adjust performance based on FPS
    if (currentFPS < 30 && deviceCapabilities?.performance === "low") {
      setShowFallback(true);
    }
  }, [currentFPS, deviceCapabilities]);

  // Adjust config based on device capabilities
  const optimizedConfig = { ...config };
  if (deviceCapabilities?.performance === "low") {
    optimizedConfig.performance.antialias = false;
    optimizedConfig.performance.shadows = false;
    optimizedConfig.performance.pixelRatio = Math.min(
      1,
      window.devicePixelRatio,
    );
  }

  if (showFallback && fallback2D) {
    return (
      <div className={`relative ${className}`}>
        {fallback2D}
        <div className="absolute top-2 right-2 bg-yellow-600 text-white px-2 py-1 rounded text-xs">
          2D Fallback Mode
        </div>
      </div>
    );
  }

  if (!deviceCapabilities) {
    return <SceneLoading />;
  }

  return (
    <div className={`relative ${className}`}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Canvas
          shadows={optimizedConfig.performance.shadows}
          dpr={optimizedConfig.performance.pixelRatio}
          gl={{
            antialias: optimizedConfig.performance.antialias,
            powerPreference: optimizedConfig.performance.powerPreference,
            alpha: true,
          }}
          onCreated={() => onSceneReady?.()}
          className="rounded-lg"
        >
          <Suspense fallback={null}>
            {/* Camera */}
            <PerspectiveCamera
              makeDefault
              position={optimizedConfig.camera.position}
              fov={optimizedConfig.camera.fov}
              near={optimizedConfig.camera.near}
              far={optimizedConfig.camera.far}
            />

            {/* Controls */}
            <OrbitControls
              enableZoom={optimizedConfig.controls.enableZoom}
              enablePan={optimizedConfig.controls.enablePan}
              enableRotate={optimizedConfig.controls.enableRotate}
              autoRotate={optimizedConfig.controls.autoRotate}
              autoRotateSpeed={optimizedConfig.controls.autoRotateSpeed}
              maxPolarAngle={optimizedConfig.controls.maxPolarAngle}
              minDistance={optimizedConfig.controls.minDistance}
              maxDistance={optimizedConfig.controls.maxDistance}
            />

            {/* Lighting */}
            <SceneLighting config={optimizedConfig.lighting} />

            {/* Environment */}
            <Environment preset="city" />

            {/* Performance Monitor */}
            <PerformanceMonitor onPerformanceChange={setCurrentFPS} />

            {/* Keyboard Controls */}
            <KeyboardControls
              enabled={optimizedConfig.accessibility.enableKeyboardControls}
            />

            {/* Scene Content */}
            {children}

            {/* Stats */}
            {enableStats && <Stats />}
          </Suspense>
        </Canvas>
      </ErrorBoundary>

      {/* Accessibility */}
      {optimizedConfig.accessibility.enableScreenReader && (
        <div className="sr-only" aria-live="polite">
          {optimizedConfig.accessibility.alternativeDescription}
        </div>
      )}

      {/* Performance indicator */}
      {enableStats && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          FPS: {Math.round(currentFPS)}
        </div>
      )}

      {/* Controls help */}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
        <div>Mouse: Rotate, Zoom, Pan</div>
        <div>Keys: WASD/Arrows to move, Q/E for up/down</div>
      </div>
    </div>
  );
};

export default Scene3DBase;
