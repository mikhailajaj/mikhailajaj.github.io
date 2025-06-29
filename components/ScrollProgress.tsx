'use client';
import React from 'react';
import { useScrollProgress } from '@/hooks/useScrollAnimation';

const ScrollProgress: React.FC = () => {
  const scrollProgress = useScrollProgress();

  return (
    <>
      {/* CSS Scroll-driven animation version */}
      <div className="scroll-progress" />
      
      {/* Fallback for browsers without support */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-50 transition-transform duration-75 ease-out"
        style={{
          width: '100%',
          transform: `scaleX(${scrollProgress})`,
          transformOrigin: 'left',
          display: 'var(--scroll-progress-fallback, none)',
        }}
      />
      
      <style jsx>{`
        @supports not (animation-timeline: scroll()) {
          :global(:root) {
            --scroll-progress-fallback: block;
          }
          .scroll-progress {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default ScrollProgress;