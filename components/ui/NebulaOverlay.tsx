"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface NebulaOverlayProps {
  className?: string;
}

/**
 * NebulaOverlay Component
 * 
 * Creates a cosmic nebula effect using CSS gradients to simulate
 * colorful gas clouds found in galaxies and deep space.
 */
export const NebulaOverlay: React.FC<NebulaOverlayProps> = ({ className }) => {
  return (
    <div className={cn("fixed inset-0 pointer-events-none", className)}>
      {/* Main nebula clouds */}
      <div className="absolute inset-0 opacity-20">
        {/* Purple nebula cloud */}
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(138,43,226,0.4) 0%, rgba(138,43,226,0.2) 30%, transparent 70%)',
            top: '10%',
            left: '15%',
            animation: 'nebulaDrift 60s ease-in-out infinite',
          }}
        />
        
        {/* Blue nebula cloud */}
        <div 
          className="absolute w-80 h-80 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(75,0,130,0.3) 0%, rgba(106,90,205,0.2) 40%, transparent 70%)',
            top: '60%',
            right: '20%',
            animation: 'nebulaDrift 45s ease-in-out infinite reverse',
          }}
        />
        
        {/* Pink nebula highlight */}
        <div 
          className="absolute w-64 h-64 rounded-full blur-2xl"
          style={{
            background: 'radial-gradient(circle, rgba(255,20,147,0.2) 0%, rgba(255,20,147,0.1) 50%, transparent 70%)',
            top: '30%',
            right: '10%',
            animation: 'nebulaPulse 30s ease-in-out infinite',
          }}
        />
        
        {/* Cyan nebula accent */}
        <div 
          className="absolute w-72 h-72 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(0,191,255,0.15) 0%, rgba(123,104,238,0.1) 60%, transparent 80%)',
            bottom: '20%',
            left: '25%',
            animation: 'nebulaDrift 50s ease-in-out infinite',
          }}
        />
      </div>

      {/* Subtle cosmic dust overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(138,43,226,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(75,0,130,0.1) 0%, transparent 50%),
            radial-gradient(circle at 60% 20%, rgba(147,112,219,0.05) 0%, transparent 40%),
            radial-gradient(circle at 30% 80%, rgba(106,90,205,0.05) 0%, transparent 40%)
          `,
        }}
      />

      <style jsx>{`
        @keyframes nebulaDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -15px) scale(1.1); }
          50% { transform: translate(-10px, 25px) scale(0.9); }
          75% { transform: translate(15px, 10px) scale(1.05); }
        }
        
        @keyframes nebulaPulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default NebulaOverlay;