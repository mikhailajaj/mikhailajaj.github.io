"use client";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef, RefObject, useCallback } from "react";


interface StarProps {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number | null;
  color: { r: number; g: number; b: number; }; 
}

interface StarBackgroundProps {
  starDensity?: number;
  allStarsTwinkle?: boolean;
  twinkleProbability?: number;
  minTwinkleSpeed?: number;
  maxTwinkleSpeed?: number;
  className?: string;
}

export const StarsBackground: React.FC<StarBackgroundProps> = ({
  starDensity = 0.00025,
  allStarsTwinkle = true,
  twinkleProbability = 7,
  minTwinkleSpeed = 0.5,
  maxTwinkleSpeed = 2,
  className,
}) => {
  const [stars, setStars] = useState<StarProps[]>([]);
  const canvasRef: RefObject<HTMLCanvasElement> =
    useRef<HTMLCanvasElement>(null);

    // Function to generate a random star color
    const getRandomStarColor = () => {
      // Array of possible star colors (you can adjust these)
      const starColors = [
        { r: 116, g: 64, b: 207 },    // White
        { r: 230, g: 9, b: 9 },    // Warm white
        { r: 9, g: 9, b: 230 },    // Cool white
        { r: 226, g: 230, b: 9 },    // Peach
        { r: 162, g: 216, b: 255 },    // Light blue
        { r: 255, g: 202, b: 202 },    // Light red
        { r: 99, g: 102, b: 241 },     // Indigo
        { r: 230, g: 131, b: 9 },     // Cyan
        { r: 0, g: 0, b: 0 },     // Orange
        { r: 255, g: 255, b: 255 },     // Lime
      ];
      
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      return color;
    };
  
    const generateStars = useCallback(
      (width: number, height: number): StarProps[] => {
        const area = width * height;
        const numStars = Math.floor(area * starDensity);
        return Array.from({ length: numStars }, () => {
          const shouldTwinkle = allStarsTwinkle || Math.random() < twinkleProbability;
          const color = getRandomStarColor();
          return {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 0.05 + 1,
            opacity: Math.random() * 0.5 + 0.5,
            twinkleSpeed: shouldTwinkle
              ? minTwinkleSpeed + Math.random() * (maxTwinkleSpeed - minTwinkleSpeed)
              : null,
            color: color,
          };
        });
      },
      [starDensity, allStarsTwinkle, twinkleProbability, minTwinkleSpeed, maxTwinkleSpeed]
    );

  useEffect(() => {
    const updateStars = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;
        setStars(generateStars(width, height));
      }
    };

    updateStars();

    const resizeObserver = new ResizeObserver(updateStars);
    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current);
    }

    return () => {
      if (canvasRef.current) {
        resizeObserver.unobserve(canvasRef.current);
      }
    };
  }, [
    starDensity,
    allStarsTwinkle,
    twinkleProbability,
    minTwinkleSpeed,
    maxTwinkleSpeed,
    generateStars,
  ]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        
        // Use the star's color with its opacity
        ctx.fillStyle = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${star.opacity})`;
        
        // Optional: Add glow effect
        ctx.shadowBlur = star.radius * 2;
        ctx.shadowColor = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${star.opacity * 0.5})`;
        
        ctx.fill();

        if (star.twinkleSpeed !== null) {
          star.opacity =
            0.5 + Math.abs(Math.sin((Date.now() * 0.001) / star.twinkleSpeed) * 0.5);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [stars]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("h-full w-full fixed inset-0 z-0", className)}
    />
  );
};
