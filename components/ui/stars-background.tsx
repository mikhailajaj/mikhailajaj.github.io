"use client";
import { cn } from "@/lib/utils";
import React, {
  useState,
  useEffect,
  useRef,
  RefObject,
  useCallback,
} from "react";

interface StarProps {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number | null;
  color: { r: number; g: number; b: number };
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

  // Function to generate theme-adaptive galaxy star colors
  const getRandomStarColor = () => {
    // Check if we're in light or dark mode for adaptive colors
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    if (isDarkMode) {
      // Dark mode: Full spectrum realistic stellar colors
      const darkStarColors = [
        { r: 255, g: 255, b: 255 }, // White dwarf
        { r: 255, g: 248, b: 220 }, // Yellow star
        { r: 173, g: 216, b: 255 }, // Blue giant
        { r: 255, g: 204, b: 111 }, // Orange star
        { r: 255, g: 180, b: 107 }, // Red giant
        { r: 135, g: 206, b: 255 }, // Hot blue star
        { r: 255, g: 228, b: 181 }, // Warm white
        { r: 186, g: 185, b: 255 }, // Blue-white
        { r: 255, g: 167, b: 95 },  // Cool orange
      ];
      return darkStarColors[Math.floor(Math.random() * darkStarColors.length)];
    } else {
      // Light mode: Enhanced contrast cosmic colors for visibility
      const lightStarColors = [
        { r: 138, g: 43, b: 226 },  // Purple (primary cosmic)
        { r: 75, g: 0, b: 130 },   // Indigo (deep cosmic)
        { r: 147, g: 112, b: 219 }, // Medium purple
        { r: 123, g: 104, b: 238 }, // Slate blue
        { r: 72, g: 61, b: 139 },  // Dark slate blue
        { r: 106, g: 90, b: 205 }, // Slate blue
        { r: 255, g: 20, b: 147 }, // Deep pink (accent)
        { r: 0, g: 191, b: 255 },  // Deep sky blue
        { r: 138, g: 43, b: 226 }, // Purple (duplicate for higher probability)
      ];
      return lightStarColors[Math.floor(Math.random() * lightStarColors.length)];
    }
  };

  const generateStars = useCallback(
    (width: number, height: number): StarProps[] => {
      const area = width * height;
      const numStars = Math.floor(area * starDensity);
      
      // Create galaxy spiral pattern
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(width, height) * 0.6;
      
      return Array.from({ length: numStars }, () => {
        const shouldTwinkle =
          allStarsTwinkle || Math.random() < twinkleProbability;
        const color = getRandomStarColor();
        
        // Create spiral galaxy distribution
        let x, y;
        if (Math.random() < 0.7) { // 70% of stars in spiral arms
          const spiralArm = Math.floor(Math.random() * 3); // 3 spiral arms
          const armAngle = (spiralArm * 120 + Math.random() * 60) * Math.PI / 180;
          const distance = Math.random() * maxRadius;
          const spiralTightness = 0.3;
          const angle = armAngle + distance * spiralTightness;
          
          x = centerX + Math.cos(angle) * distance + (Math.random() - 0.5) * 50;
          y = centerY + Math.sin(angle) * distance + (Math.random() - 0.5) * 50;
        } else { // 30% scattered throughout
          x = Math.random() * width;
          y = Math.random() * height;
        }
        
        // Ensure stars stay within bounds
        x = Math.max(0, Math.min(width, x));
        y = Math.max(0, Math.min(height, y));
        
        // Vary star sizes based on type
        const starType = Math.random();
        let radius;
        if (starType < 0.1) { // 10% large stars
          radius = Math.random() * 2 + 2;
        } else if (starType < 0.3) { // 20% medium stars
          radius = Math.random() * 1 + 1.5;
        } else { // 70% small stars
          radius = Math.random() * 0.5 + 0.8;
        }
        
        return {
          x,
          y,
          radius,
          opacity: Math.random() * 0.6 + 0.4,
          twinkleSpeed: shouldTwinkle
            ? minTwinkleSpeed +
              Math.random() * (maxTwinkleSpeed - minTwinkleSpeed)
            : null,
          color: color,
        };
      });
    },
    [
      starDensity,
      allStarsTwinkle,
      twinkleProbability,
      minTwinkleSpeed,
      maxTwinkleSpeed,
    ],
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
            0.5 +
            Math.abs(Math.sin((Date.now() * 0.001) / star.twinkleSpeed) * 0.5);
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
