"use client";

import React from "react";

export const Scene3DSkeleton: React.FC = () => {
  return (
    <div className="relative w-full h-64 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      {/* 3D Scene Loading Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
            {Array.from({ length: 48 }).map((_, i) => (
              <div
                key={i}
                className="border border-gray-600 animate-pulse"
                style={{
                  animationDelay: `${i * 50}ms`,
                  animationDuration: "2s",
                }}
              />
            ))}
          </div>
        </div>

        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Central Loading Spinner */}
            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>

            {/* Orbiting Elements */}
            <div
              className="absolute inset-0 animate-spin"
              style={{ animationDuration: "3s" }}
            >
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-400 rounded-full"></div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-purple-400 rounded-full"></div>
              <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-3 h-3 bg-green-400 rounded-full"></div>
              <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-3 h-3 bg-orange-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 200}ms`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Loading Text */}
      <div className="absolute bottom-4 left-4 text-white">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
          <span className="text-sm text-gray-300">Loading 3D Scene</span>
        </div>
      </div>

      {/* Controls Skeleton */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-lg p-3">
        <div className="space-y-2">
          <div className="h-3 bg-gray-600 rounded w-20"></div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-600 rounded"></div>
              <div className="h-2 bg-gray-600 rounded w-16"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-600 rounded"></div>
              <div className="h-2 bg-gray-600 rounded w-12"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend Skeleton */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 rounded-lg p-3">
        <div className="h-3 bg-gray-600 rounded w-16 mb-2"></div>
        <div className="space-y-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-600 rounded"></div>
              <div className="h-2 bg-gray-600 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Indicator Skeleton */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 rounded px-2 py-1">
        <div className="h-2 bg-gray-600 rounded w-12"></div>
      </div>
    </div>
  );
};

export default Scene3DSkeleton;
