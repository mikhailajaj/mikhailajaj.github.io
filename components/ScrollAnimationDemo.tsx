'use client';
import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

interface ScrollAnimatedElementProps {
  children: React.ReactNode;
  animation: 'fade-in' | 'scale-in' | 'slide-left' | 'slide-right' | 'rotate' | 'text-reveal';
  className?: string;
  delay?: number;
}

const ScrollAnimatedElement: React.FC<ScrollAnimatedElementProps> = ({
  children,
  animation,
  className = '',
  delay = 0,
}) => {
  const { ref, isVisible, supportsScrollTimeline } = useScrollAnimation();

  const animationClasses = {
    'fade-in': 'fade-in-scroll',
    'scale-in': 'scale-in-scroll',
    'slide-left': 'slide-left-scroll',
    'slide-right': 'slide-right-scroll',
    'rotate': 'rotate-scroll',
    'text-reveal': 'text-reveal',
  };

  const fallbackClasses = {
    'fade-in': 'scroll-animation-fallback',
    'scale-in': 'scroll-animation-fallback',
    'slide-left': 'scroll-animation-fallback',
    'slide-right': 'scroll-animation-fallback',
    'rotate': 'scroll-animation-fallback',
    'text-reveal': 'scroll-animation-fallback',
  };

  return (
    <div
      ref={ref}
      className={cn(
        supportsScrollTimeline 
          ? animationClasses[animation]
          : fallbackClasses[animation],
        !supportsScrollTimeline && isVisible && 'visible',
        className
      )}
      style={delay > 0 ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
};

const ScrollAnimationDemo: React.FC = () => {
  return (
    <div className="space-y-20 py-20">
      {/* Progress Bar */}
      <div className="scroll-progress"></div>

      {/* Hero Section with Text Reveal */}
      <section className="min-h-screen flex items-center justify-center">
        <ScrollAnimatedElement animation="text-reveal" className="text-center">
          <h1 className="text-6xl font-bold mb-4">
            Scroll-Driven Animations
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Experience the power of CSS scroll-driven animations
          </p>
        </ScrollAnimatedElement>
      </section>

      {/* Fade In Section */}
      <section className="container mx-auto px-4">
        <ScrollAnimatedElement animation="fade-in">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-lg text-white">
            <h2 className="text-3xl font-bold mb-4">Fade In Animation</h2>
            <p className="text-lg">
              This element fades in as you scroll down. The animation is triggered when the element enters the viewport.
            </p>
          </div>
        </ScrollAnimatedElement>
      </section>

      {/* Scale In Section */}
      <section className="container mx-auto px-4">
        <ScrollAnimatedElement animation="scale-in">
          <div className="bg-gradient-to-r from-green-500 to-teal-600 p-8 rounded-lg text-white">
            <h2 className="text-3xl font-bold mb-4">Scale In Animation</h2>
            <p className="text-lg">
              This element scales up from 80% to 100% as it enters the viewport.
            </p>
          </div>
        </ScrollAnimatedElement>
      </section>

      {/* Slide Animations */}
      <section className="container mx-auto px-4 grid md:grid-cols-2 gap-8">
        <ScrollAnimatedElement animation="slide-left">
          <div className="bg-gradient-to-r from-pink-500 to-rose-600 p-8 rounded-lg text-white">
            <h2 className="text-2xl font-bold mb-4">Slide from Left</h2>
            <p>This element slides in from the left side.</p>
          </div>
        </ScrollAnimatedElement>

        <ScrollAnimatedElement animation="slide-right">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-8 rounded-lg text-white">
            <h2 className="text-2xl font-bold mb-4">Slide from Right</h2>
            <p>This element slides in from the right side.</p>
          </div>
        </ScrollAnimatedElement>
      </section>

      {/* Rotate Animation */}
      <section className="container mx-auto px-4">
        <ScrollAnimatedElement animation="rotate">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-8 rounded-lg text-white">
            <h2 className="text-3xl font-bold mb-4">Rotate Animation</h2>
            <p className="text-lg">
              This element rotates as it enters the viewport.
            </p>
          </div>
        </ScrollAnimatedElement>
      </section>

      {/* Stagger Animation */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Staggered List Animation</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="stagger-item">
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Item {item}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  This item appears with a staggered delay.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Parallax Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="parallax-slow absolute inset-0 bg-gradient-to-br from-purple-900 to-blue-900 opacity-50"></div>
        <div className="parallax-fast absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-yellow-500/20"></div>
        <div className="relative z-10 text-center text-white">
          <h2 className="text-5xl font-bold mb-4">Parallax Effect</h2>
          <p className="text-xl">Background layers move at different speeds</p>
        </div>
      </section>

      {/* Image Zoom Section */}
      <section className="container mx-auto px-4">
        <div className="image-zoom-scroll rounded-lg overflow-hidden">
          <img 
            src="/api/placeholder/800/400" 
            alt="Zoom animation demo"
            className="w-full h-96 object-cover"
          />
        </div>
      </section>

      {/* Border Draw Animation */}
      <section className="container mx-auto px-4">
        <div className="border-draw p-8 rounded-lg bg-white dark:bg-gray-900">
          <h2 className="text-3xl font-bold mb-4">Border Draw Animation</h2>
          <p className="text-lg">
            Watch the animated border appear as you scroll!
          </p>
        </div>
      </section>

      {/* Typewriter Effect */}
      <section className="container mx-auto px-4 text-center">
        <h2 className="typewriter-scroll text-4xl font-bold">
          This text types itself as you scroll!
        </h2>
      </section>
    </div>
  );
};

export default ScrollAnimationDemo;