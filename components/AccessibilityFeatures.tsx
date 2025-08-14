"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaKeyboard, FaEye, FaVolumeUp, FaAdjust, FaCog } from "react-icons/fa";

interface AccessibilityState {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  keyboardNavigation: boolean;
  screenReaderMode: boolean;
}

const AccessibilityFeatures: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilityState>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    keyboardNavigation: false,
    screenReaderMode: false,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("accessibility-settings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      applySettings(parsed);
    }

    // Check for user's motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) {
      setSettings((prev) => ({ ...prev, reducedMotion: true }));
    }
  }, []);

  // Save settings to localStorage and apply them
  const updateSetting = (key: keyof AccessibilityState, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem("accessibility-settings", JSON.stringify(newSettings));
    applySettings(newSettings);
  };

  const applySettings = (settings: AccessibilityState) => {
    const root = document.documentElement;

    // High contrast mode
    if (settings.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    // Large text mode
    if (settings.largeText) {
      root.classList.add("large-text");
    } else {
      root.classList.remove("large-text");
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }

    // Keyboard navigation indicators
    if (settings.keyboardNavigation) {
      root.classList.add("keyboard-navigation");
    } else {
      root.classList.remove("keyboard-navigation");
    }

    // Screen reader optimizations
    if (settings.screenReaderMode) {
      root.classList.add("screen-reader-mode");
    } else {
      root.classList.remove("screen-reader-mode");
    }
  };

  const resetSettings = () => {
    const defaultSettings: AccessibilityState = {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      keyboardNavigation: false,
      screenReaderMode: false,
    };
    setSettings(defaultSettings);
    localStorage.setItem(
      "accessibility-settings",
      JSON.stringify(defaultSettings),
    );
    applySettings(defaultSettings);
  };

  return (
    <>
      {/* Accessibility Button */}
      {(() => {
        const MotionButton = motion.button as any;
        return (
          <MotionButton
            onClick={() => setIsOpen(!isOpen)}
            className="fixed bottom-4 left-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open accessibility settings"
            aria-expanded={isOpen}
          >
            <FaCog className="w-5 h-5" />
          </MotionButton>
        );
      })()}

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isOpen &&
          (() => {
            const MotionDiv = motion.div as any;
            return (
              <MotionDiv
                initial={{ opacity: 0, x: -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-20 left-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-6 w-80"
                role="dialog"
                aria-labelledby="accessibility-title"
                aria-describedby="accessibility-description"
              >
                <div className="mb-4">
                  <h3
                    id="accessibility-title"
                    className="text-lg font-semibold text-gray-900 dark:text-white mb-2"
                  >
                    Accessibility Settings
                  </h3>
                  <p
                    id="accessibility-description"
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    Customize your viewing experience
                  </p>
                </div>

                <div className="space-y-4">
                  {/* High Contrast */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaAdjust className="text-gray-500 mr-3" />
                      <div>
                        <label
                          htmlFor="high-contrast"
                          className="text-sm font-medium text-gray-900 dark:text-white"
                        >
                          High Contrast
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Increase color contrast
                        </p>
                      </div>
                    </div>
                    <button
                      id="high-contrast"
                      onClick={() =>
                        updateSetting("highContrast", !settings.highContrast)
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        settings.highContrast
                          ? "bg-blue-600"
                          : "bg-gray-200 dark:bg-gray-600"
                      }`}
                      role="switch"
                      aria-checked={settings.highContrast}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.highContrast
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Large Text */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaEye className="text-gray-500 mr-3" />
                      <div>
                        <label
                          htmlFor="large-text"
                          className="text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Large Text
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Increase font size
                        </p>
                      </div>
                    </div>
                    <button
                      id="large-text"
                      onClick={() =>
                        updateSetting("largeText", !settings.largeText)
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        settings.largeText
                          ? "bg-blue-600"
                          : "bg-gray-200 dark:bg-gray-600"
                      }`}
                      role="switch"
                      aria-checked={settings.largeText}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.largeText ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Reduced Motion */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaAdjust className="text-gray-500 mr-3" />
                      <div>
                        <label
                          htmlFor="reduced-motion"
                          className="text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Reduced Motion
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Minimize animations
                        </p>
                      </div>
                    </div>
                    <button
                      id="reduced-motion"
                      onClick={() =>
                        updateSetting("reducedMotion", !settings.reducedMotion)
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        settings.reducedMotion
                          ? "bg-blue-600"
                          : "bg-gray-200 dark:bg-gray-600"
                      }`}
                      role="switch"
                      aria-checked={settings.reducedMotion}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.reducedMotion
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Keyboard Navigation */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaKeyboard className="text-gray-500 mr-3" />
                      <div>
                        <label
                          htmlFor="keyboard-nav"
                          className="text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Keyboard Navigation
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Enhanced focus indicators
                        </p>
                      </div>
                    </div>
                    <button
                      id="keyboard-nav"
                      onClick={() =>
                        updateSetting(
                          "keyboardNavigation",
                          !settings.keyboardNavigation,
                        )
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        settings.keyboardNavigation
                          ? "bg-blue-600"
                          : "bg-gray-200 dark:bg-gray-600"
                      }`}
                      role="switch"
                      aria-checked={settings.keyboardNavigation}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.keyboardNavigation
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Screen Reader Mode */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaVolumeUp className="text-gray-500 mr-3" />
                      <div>
                        <label
                          htmlFor="screen-reader"
                          className="text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Screen Reader Mode
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Optimize for screen readers
                        </p>
                      </div>
                    </div>
                    <button
                      id="screen-reader"
                      onClick={() =>
                        updateSetting(
                          "screenReaderMode",
                          !settings.screenReaderMode,
                        )
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        settings.screenReaderMode
                          ? "bg-blue-600"
                          : "bg-gray-200 dark:bg-gray-600"
                      }`}
                      role="switch"
                      aria-checked={settings.screenReaderMode}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.screenReaderMode
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Reset Button */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={resetSettings}
                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Reset to Default
                  </button>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  aria-label="Close accessibility settings"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </MotionDiv>
            );
          })()}
      </AnimatePresence>

      {/* CSS for accessibility features */}
      <style jsx global>{`
        .high-contrast {
          filter: contrast(150%);
        }

        .large-text {
          font-size: 120% !important;
        }

        .large-text * {
          font-size: inherit !important;
        }

        .reduce-motion * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }

        .keyboard-navigation *:focus {
          outline: 3px solid #3b82f6 !important;
          outline-offset: 2px !important;
        }

        .screen-reader-mode .sr-only {
          position: static !important;
          width: auto !important;
          height: auto !important;
          padding: 0 !important;
          margin: 0 !important;
          overflow: visible !important;
          clip: auto !important;
          white-space: normal !important;
        }
      `}</style>
    </>
  );
};

export default AccessibilityFeatures;
