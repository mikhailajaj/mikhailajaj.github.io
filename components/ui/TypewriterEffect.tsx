"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * Props interface for TypewriterEffect component
 */
interface TypewriterEffectProps {
  /** Array of words/phrases to cycle through */
  words: string[];
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * TypewriterEffect Component
 *
 * Creates an animated typewriter effect that cycles through an array of words,
 * typing each word character by character, then deleting it before moving to the next.
 *
 * @component
 * @example
 * ```tsx
 * <TypewriterEffect
 *   words={['web applications', 'mobile apps', 'cloud solutions']}
 *   className="text-blue-600 font-bold"
 * />
 * ```
 *
 * Features:
 * - Smooth typing and deleting animations
 * - Configurable typing and deleting speeds
 * - Infinite loop through word array
 * - Animated blinking cursor
 * - Framer Motion integration for smooth transitions
 * - Customizable styling via className
 *
 * Animation Timing:
 * - Typing speed: 100ms per character
 * - Deleting speed: 50ms per character
 * - Pause between words: 1500ms
 *
 * @param {TypewriterEffectProps} props - The component props
 * @returns {JSX.Element} The animated typewriter text with cursor
 */
const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  words,
  className = "",
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex];

    const typeSpeed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        setCurrentText(word.substring(0, currentText.length + 1));

        // If word is complete, start deleting after a pause
        if (currentText === word) {
          setTimeout(() => {
            setIsDeleting(true);
          }, 1500);
        }
      } else {
        // Deleting
        setCurrentText(word.substring(0, currentText.length - 1));

        // If deletion is complete, move to next word
        if (currentText === "") {
          setIsDeleting(false);
          setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, currentWordIndex, isDeleting, words]);

  return (
    <motion.span
      className={`inline-block ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {currentText}
      <span className="animate-blink">|</span>
    </motion.span>
  );
};

export default TypewriterEffect;
