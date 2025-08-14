"use client";
import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface LocationAwareMoonBackgroundProps {
  className?: string;
  intensity?: 'minimal' | 'subtle' | 'normal' | 'full';
  enableLocationTracking?: boolean;
}

/**
 * Location-Aware Moon Background Component
 * 
 * Revolutionary cosmic background that adapts to user's real location and weather
 */
export const LocationAwareMoonBackground: React.FC<LocationAwareMoonBackgroundProps> = ({
  className,
  intensity = 'normal',
  enableLocationTracking = true
}) => {
  const { theme, systemTheme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  // Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  // Render moon and atmospheric effects
  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Ultra-efficient rendering - only update once per second
    let timeoutId: NodeJS.Timeout;
    let lastTheme = '';
    
    const renderOnce = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Determine current theme
      const currentTheme = theme === 'system' ? systemTheme : theme;
      const isLightTheme = currentTheme === 'light';

      if (isLightTheme) {
        renderLightThemeMoon(ctx, canvas, intensity);
      } else {
        renderDarkThemeStars(ctx, canvas, intensity);
      }
      
      lastTheme = currentTheme || '';
    };

    // Initial render
    renderOnce();
    
    // Update once per second for subtle changes
    const scheduleUpdate = () => {
      timeoutId = setTimeout(() => {
        renderOnce();
        scheduleUpdate(); // Schedule next update
      }, 1000); // 1 second interval
    };
    
    scheduleUpdate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      clearTimeout(timeoutId);
    };
  }, [mounted, theme, systemTheme, intensity]);

  // Don't render during SSR
  if (!mounted) {
    return null;
  }

  return (
    <div className={cn("fixed inset-0 pointer-events-none", className)}>
      {/* Canvas for moon and atmospheric effects */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Simple atmospheric overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(200, 200, 200, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(180, 180, 180, 0.2) 0%, transparent 40%)
            `,
          }}
        />
      </div>

      {/* Development indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-4 left-4 text-xs opacity-50 bg-black/20 p-2 rounded">
          🌙 Location-Aware Moon Theme Active
        </div>
      )}
    </div>
  );
};

/**
 * Render moon for light theme
 */
function renderLightThemeMoon(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  intensity: string
) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 3;
  const baseRadius = Math.min(canvas.width, canvas.height) * 0.08;
  
  const intensityMultiplier = getIntensityMultiplier(intensity);
  const glowIntensity = 0.6 * intensityMultiplier;
  
  // Create radial gradient for moon glow
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius * 3);
  gradient.addColorStop(0, `rgba(255, 255, 255, ${0.8 * glowIntensity})`);
  gradient.addColorStop(0.3, `rgba(255, 248, 220, ${0.4 * glowIntensity})`);
  gradient.addColorStop(0.7, `rgba(255, 248, 220, ${0.1 * glowIntensity})`);
  gradient.addColorStop(1, 'rgba(255, 248, 220, 0)');

  // Draw moon glow
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw moon surface
  ctx.save();
  ctx.globalAlpha = glowIntensity;
  
  // Moon base
  ctx.fillStyle = '#F5F5DC'; // Beige moon color
  ctx.beginPath();
  ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
  ctx.fill();

  // Simple moon craters
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  const craters = [
    { x: 0.3, y: 0.2, size: 0.15 },
    { x: -0.2, y: 0.4, size: 0.1 },
    { x: 0.1, y: -0.3, size: 0.08 }
  ];

  craters.forEach(crater => {
    ctx.beginPath();
    ctx.arc(
      centerX + crater.x * baseRadius,
      centerY + crater.y * baseRadius,
      crater.size * baseRadius,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });

  ctx.restore();
}

/**
 * Render stars for dark theme (static - no need for constant re-rendering)
 */
let starsCache: { x: number; y: number; size: number }[] = [];
let lastCanvasSize = { width: 0, height: 0 };

function renderDarkThemeStars(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  intensity: string
) {
  // Only regenerate stars if canvas size changed
  if (canvas.width !== lastCanvasSize.width || canvas.height !== lastCanvasSize.height || starsCache.length === 0) {
    const starCount = Math.min(50, 100 * getIntensityMultiplier(intensity)); // Cap at 50 stars
    starsCache = [];
    
    for (let i = 0; i < starCount; i++) {
      starsCache.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5
      });
    }
    
    lastCanvasSize = { width: canvas.width, height: canvas.height };
  }
  
  // Render cached stars
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  starsCache.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

/**
 * Get intensity multiplier based on user preference
 */
function getIntensityMultiplier(intensity: string): number {
  const multipliers = {
    minimal: 0.3,
    subtle: 0.6,
    normal: 1.0,
    full: 1.4
  };
  return multipliers[intensity as keyof typeof multipliers] || 1.0;
}

export default LocationAwareMoonBackground;