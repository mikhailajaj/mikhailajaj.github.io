"use client";

/**
 * Infinite Moving Cards Component
 *
 * Creates an infinite scrolling carousel of testimonial cards with smooth animations
 * and customizable speed, direction, and hover behavior.
 *
 * @fileoverview Infinite scrolling testimonial cards with CSS animations
 */

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";

/**
 * Testimonial item interface for the infinite cards
 */
interface TestimonialItem {
  /** The testimonial quote text */
  quote: string;
  /** Name of the person giving the testimonial */
  name: string;
  /** Job title or position of the testimonial author */
  title: string;
}

/**
 * Props interface for InfiniteMovingCards component
 */
interface InfiniteMovingCardsProps {
  /** Array of testimonial items to display */
  items: TestimonialItem[];
  /** Direction of card movement */
  direction?: "left" | "right";
  /** Speed of the animation */
  speed?: "fast" | "normal" | "slow";
  /** Whether to pause animation on hover */
  pauseOnHover?: boolean;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * InfiniteMovingCards Component
 *
 * A smooth infinite scrolling carousel component for displaying testimonials
 * or other card-based content with customizable animations.
 *
 * @component
 * @example
 * ```tsx
 * const testimonials = [
 *   {
 *     quote: "Excellent work on our project!",
 *     name: "John Doe",
 *     title: "CEO, Tech Corp"
 *   }
 * ];
 *
 * <InfiniteMovingCards
 *   items={testimonials}
 *   direction="left"
 *   speed="fast"
 *   pauseOnHover={true}
 * />
 * ```
 *
 * Features:
 * - Smooth infinite scrolling animation
 * - Customizable speed (fast: 20s, normal: 40s, slow: 80s)
 * - Bidirectional movement (left/right)
 * - Hover pause functionality
 * - Responsive design with mobile optimization
 * - Gradient mask for smooth edge transitions
 * - Automatic content duplication for seamless loop
 *
 * Animation Details:
 * - Uses CSS custom properties for dynamic control
 * - Duplicates content for seamless infinite scroll
 * - Gradient mask creates smooth fade-in/out edges
 * - Pause on hover maintains user control
 *
 * @param {InfiniteMovingCardsProps} props - The component props
 * @returns {JSX.Element} The infinite moving cards carousel
 */
export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: InfiniteMovingCardsProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);

  /**
   * Initializes the infinite scroll animation
   *
   * Duplicates the card content to create seamless infinite scroll,
   * sets animation direction and speed, then starts the animation.
   */
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  /**
   * Sets the CSS animation direction based on the direction prop
   *
   * Maps component direction prop to CSS animation direction:
   * - "left" -> "forwards" (left to right movement)
   * - "right" -> "reverse" (right to left movement)
   */
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  };

  /**
   * Sets the CSS animation duration based on the speed prop
   *
   * Speed mappings:
   * - "fast": 20s duration
   * - "normal": 40s duration
   * - "slow": 80s duration
   */
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        // max-w-7xl to w-screen
        "scroller relative z-20 w-screen overflow-hidden  [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          // change gap-16
          " flex min-w-full shrink-0 gap-16 py-4 w-max flex-nowrap",
          start && "animate-scroll ",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item, idx) => (
          <li
            //   change md:w-[450px] to md:w-[60vw] , px-8 py-6 to p-16, border-slate-700 to border-slate-800
            className="w-[90vw] max-w-full relative rounded-2xl border border-b-0
             flex-shrink-0 border-slate-800 p-5 md:p-16 md:w-[60vw]"
            style={{
              //   background:
              //     "linear-gradient(180deg, var(--slate-800), var(--slate-900)", //remove this one
              //   add these two
              //   you can generate the color from here https://cssgradient.io/
              background: "rgb(4,7,29)",
              backgroundColor:
                "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
            }}
            // change to idx cuz we have the same name
            key={idx}
          >
            <blockquote>
              <div
                aria-hidden="true"
                className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>
              {/* change text color, text-lg */}
              <span className=" relative z-20 text-sm md:text-lg leading-[1.6] text-white font-normal">
                {item.quote}
              </span>
              <div className="relative z-20 mt-6 flex flex-row items-center">
                {/* add this div for the profile img */}
                <div className="me-3">
                  <Image
                    src="/profile.svg"
                    alt="profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <span className="flex flex-col gap-1">
                  {/* change text color, font-normal to font-bold, text-xl */}
                  <span className="text-xl font-bold leading-[1.6] text-white">
                    {item.name}
                  </span>
                  {/* change text color */}
                  <span className=" text-sm leading-[1.6] text-white-200 font-normal">
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
