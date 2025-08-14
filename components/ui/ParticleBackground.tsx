"use client";
import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Set canvas dimensions
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Cosmic dust and nebula particles
    const particlesArray = [];
    const numberOfParticles = 150;

    // Galaxy nebula colors
    const nebulaColors = [
      'rgba(138, 43, 226, ', // Blue Violet
      'rgba(75, 0, 130, ',   // Indigo  
      'rgba(147, 112, 219, ', // Medium Purple
      'rgba(123, 104, 238, ', // Medium Slate Blue
      'rgba(72, 61, 139, ',  // Dark Slate Blue
      'rgba(106, 90, 205, ', // Slate Blue
      'rgba(255, 20, 147, ', // Deep Pink (for nebula highlights)
      'rgba(0, 191, 255, ',  // Deep Sky Blue
    ];

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25; // Slower, more cosmic drift
        this.speedY = Math.random() * 0.5 - 0.25;
        this.colorBase = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
        this.opacity = Math.random() * 0.4 + 0.1;
        this.color = `${this.colorBase}${this.opacity})`;
        this.pulseSpeed = Math.random() * 0.02 + 0.01; // Gentle pulsing
        this.pulseOffset = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges for continuous cosmic flow
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;

        // Update pulsing opacity
        const time = Date.now() * 0.001;
        this.opacity = 0.1 + Math.abs(Math.sin(time * this.pulseSpeed + this.pulseOffset)) * 0.3;
        this.color = `${this.colorBase}${this.opacity})`;
      }

      draw() {
        // Create glowing nebula effect
        ctx.shadowBlur = this.size * 3;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Reset shadow for connections
        ctx.shadowBlur = 0;
      }
    }

    // Create particles
    const init = () => {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };

    init();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw cosmic energy connections between particles
      const connectParticles = () => {
        for (let a = 0; a < particlesArray.length; a++) {
          for (let b = a; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x;
            const dy = particlesArray[a].y - particlesArray[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
              const opacity = (1 - distance / 120) * 0.15;
              // Create gradient connection for cosmic energy effect
              const gradient = ctx.createLinearGradient(
                particlesArray[a].x, particlesArray[a].y,
                particlesArray[b].x, particlesArray[b].y
              );
              gradient.addColorStop(0, `rgba(138, 43, 226, ${opacity})`);
              gradient.addColorStop(0.5, `rgba(147, 112, 219, ${opacity * 0.5})`);
              gradient.addColorStop(1, `rgba(75, 0, 130, ${opacity})`);
              
              ctx.strokeStyle = gradient;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
              ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
              ctx.stroke();
            }
          }
        }
      };

      connectParticles();

      // Update and draw particles
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 opacity-30 dark:opacity-50"
    />
  );
};

export default ParticleBackground;
