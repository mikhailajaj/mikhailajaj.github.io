"use client";

import React from "react";

export const CalculatorSkeleton: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-gray-700 rounded"></div>
        <div className="h-8 bg-gray-700 rounded w-64"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Controls Skeleton */}
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="h-6 bg-gray-700 rounded w-48 mb-4"></div>

            {/* Slider Skeletons */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-gray-700 rounded w-32"></div>
                  <div className="h-4 bg-gray-700 rounded w-12"></div>
                </div>
                <div className="h-2 bg-gray-600 rounded-full mb-1">
                  <div className="h-2 bg-gray-500 rounded-full w-1/2"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-700 rounded w-12"></div>
                  <div className="h-3 bg-gray-700 rounded w-12"></div>
                </div>
              </div>
            ))}

            {/* Input Field Skeleton */}
            <div className="mb-4">
              <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
              <div className="h-12 bg-gray-700 rounded w-full"></div>
            </div>
          </div>
        </div>

        {/* Results Display Skeleton */}
        <div className="space-y-6">
          {/* Key Metrics Skeleton */}
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-gray-800 p-4 rounded-lg border border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-gray-700 rounded w-20"></div>
                  <div className="w-5 h-5 bg-gray-700 rounded"></div>
                </div>
                <div className="h-8 bg-gray-700 rounded w-24"></div>
              </div>
            ))}
          </div>

          {/* Chart Skeletons */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="h-5 bg-gray-700 rounded w-32 mb-4"></div>
            <div className="h-48 bg-gray-700 rounded"></div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="h-5 bg-gray-700 rounded w-32 mb-4"></div>
            <div className="h-48 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>

      {/* Recommendations Skeleton */}
      <div className="mt-8 bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="h-5 bg-gray-700 rounded w-40 mb-4"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-2 h-2 bg-gray-700 rounded-full mt-2"></div>
              <div className="h-4 bg-gray-700 rounded flex-1"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Skeleton */}
      <div className="mt-8 bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="h-5 bg-gray-700 rounded w-40 mb-4"></div>
        <div className="h-72 bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};

export default CalculatorSkeleton;
