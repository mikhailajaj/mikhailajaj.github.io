"use client";

import React from "react";

export const InteractiveSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-gray-800 rounded-lg border border-gray-700 p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-6 bg-gray-700 rounded"></div>
        <div className="h-6 bg-gray-700 rounded w-48"></div>
      </div>

      {/* Content Area */}
      <div className="space-y-4">
        {/* Code Editor Skeleton */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
          <div className="flex items-center justify-between mb-3">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="h-4 bg-gray-700 rounded w-20"></div>
          </div>

          {/* Code Lines */}
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-6 h-4 bg-gray-600 rounded text-xs"></div>
                <div
                  className="h-4 bg-gray-700 rounded"
                  style={{ width: `${Math.random() * 60 + 20}%` }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-700 rounded w-16"></div>
            <div className="h-8 bg-gray-700 rounded w-20"></div>
            <div className="h-8 bg-gray-700 rounded w-14"></div>
          </div>
          <div className="h-8 bg-blue-600 rounded w-24"></div>
        </div>

        {/* Output Area */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
          <div className="h-4 bg-gray-700 rounded w-16 mb-3"></div>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-3 bg-gray-700 rounded"
                style={{ width: `${Math.random() * 40 + 40}%` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const DemoSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-gray-800 rounded-lg border border-gray-700 p-6 animate-pulse">
      {/* Project Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-6 bg-gray-700 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-32"></div>
        </div>
        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-gray-700 rounded"></div>
          <div className="w-8 h-8 bg-gray-700 rounded"></div>
        </div>
      </div>

      {/* Technology Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-6 bg-gray-700 rounded w-16"></div>
        ))}
      </div>

      {/* Demo Area */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-600 mb-4">
        <div className="h-48 bg-gray-700 rounded flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-600 rounded-full mx-auto mb-2"></div>
            <div className="h-4 bg-gray-600 rounded w-24"></div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <div className="h-10 bg-blue-600 rounded w-24"></div>
        <div className="h-10 bg-gray-700 rounded w-20"></div>
        <div className="h-10 bg-gray-700 rounded w-16"></div>
      </div>
    </div>
  );
};

export default InteractiveSkeleton;
