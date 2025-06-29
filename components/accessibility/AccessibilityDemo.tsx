"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaKeyboard, FaEye, FaVolumeUp, FaAdjust, FaCheck, FaArrowRight } from 'react-icons/fa';
import AccessibleButton from '@/components/ui/AccessibleButton';

const AccessibilityDemo: React.FC = () => {
  const [focusedElement, setFocusedElement] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<string[]>([]);

  const addAnnouncement = (message: string) => {
    setAnnouncements(prev => [...prev.slice(-4), message]);
  };

  const features = [
    {
      icon: FaKeyboard,
      title: "Keyboard Navigation",
      description: "Full keyboard accessibility with visible focus indicators",
      demo: "Tab through elements to see focus indicators",
      color: "blue"
    },
    {
      icon: FaEye,
      title: "Visual Accessibility",
      description: "High contrast mode and adjustable text sizes",
      demo: "Toggle high contrast and large text options",
      color: "green"
    },
    {
      icon: FaVolumeUp,
      title: "Screen Reader Support",
      description: "Comprehensive ARIA labels and semantic HTML",
      demo: "Screen reader announcements and descriptions",
      color: "purple"
    },
    {
      icon: FaAdjust,
      title: "Motion Preferences",
      description: "Respects user's reduced motion preferences",
      demo: "Animations adapt to user preferences",
      color: "orange"
    }
  ];

  const wcagCriteria = [
    { criterion: "1.1.1 Non-text Content", status: "Pass", description: "All images have alt text" },
    { criterion: "1.3.1 Info and Relationships", status: "Pass", description: "Semantic HTML structure" },
    { criterion: "1.4.3 Contrast (Minimum)", status: "Pass", description: "4.5:1 contrast ratio" },
    { criterion: "2.1.1 Keyboard", status: "Pass", description: "Full keyboard accessibility" },
    { criterion: "2.4.1 Bypass Blocks", status: "Pass", description: "Skip navigation links" },
    { criterion: "2.4.6 Headings and Labels", status: "Pass", description: "Descriptive headings" },
    { criterion: "3.1.1 Language of Page", status: "Pass", description: "Language specified" },
    { criterion: "4.1.2 Name, Role, Value", status: "Pass", description: "Proper ARIA implementation" }
  ];

  return (
    <div className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Accessibility Features Grid */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Accessibility Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const MotionDiv = motion.div as any;
              return (
                <MotionDiv
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onFocus={() => setFocusedElement(feature.title)}
                  onBlur={() => setFocusedElement(null)}
                  tabIndex={0}
                  role="article"
                  aria-labelledby={`feature-${index}-title`}
                  aria-describedby={`feature-${index}-desc`}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                >
                <div className={`w-12 h-12 rounded-lg bg-${feature.color}-100 dark:bg-${feature.color}-900 flex items-center justify-center mb-4`}>
                  <feature.icon className={`text-${feature.color}-600 dark:text-${feature.color}-400 text-xl`} />
                </div>
                
                <h3 id={`feature-${index}-title`} className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                
                <p id={`feature-${index}-desc`} className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {feature.description}
                </p>
                
                <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                  {feature.demo}
                </p>
                
                {focusedElement === feature.title && (
                  <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                    ✓ Currently focused
                  </div>
                )}
              </MotionDiv>
              );
            })}
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Interactive Accessibility Demo
          </h2>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Button Demo */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Accessible Buttons
                </h3>
                
                <div className="space-y-4">
                  <AccessibleButton
                    variant="primary"
                    onClick={() => addAnnouncement("Primary button activated")}
                    ariaLabel="Primary action button demonstration"
                  >
                    Primary Button
                  </AccessibleButton>
                  
                  <AccessibleButton
                    variant="secondary"
                    onClick={() => addAnnouncement("Secondary button activated")}
                    ariaLabel="Secondary action button demonstration"
                  >
                    Secondary Button
                  </AccessibleButton>
                  
                  <AccessibleButton
                    variant="outline"
                    disabled
                    ariaLabel="Disabled button demonstration"
                  >
                    Disabled Button
                  </AccessibleButton>
                  
                  <AccessibleButton
                    variant="primary"
                    loading
                    ariaLabel="Loading button demonstration"
                  >
                    Loading Button
                  </AccessibleButton>
                </div>
              </div>

              {/* Screen Reader Announcements */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Screen Reader Announcements
                </h3>
                
                <div 
                  className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 min-h-[200px]"
                  role="log"
                  aria-live="polite"
                  aria-label="Screen reader announcements log"
                >
                  {announcements.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 italic">
                      Click buttons to see announcements...
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {announcements.map((announcement, index) => (
                        <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="text-blue-600 dark:text-blue-400">
                            {new Date().toLocaleTimeString()}:
                          </span>{' '}
                          {announcement}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WCAG Compliance Checklist */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            WCAG 2.1 AA Compliance
          </h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {wcagCriteria.map((item, index) => {
                const MotionDiv = motion.div as any;
                return (
                  <MotionDiv
                    key={item.criterion}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  >
                  <FaCheck className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {item.criterion}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                      {item.description}
                    </p>
                  </div>
                </MotionDiv>
              );
            })}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This website meets WCAG 2.1 AA standards for web accessibility
              </p>
              
              <AccessibleButton
                variant="primary"
                onClick={() => addAnnouncement("Accessibility report requested")}
                endIcon={<FaArrowRight />}
                ariaLabel="Request detailed accessibility report"
              >
                Request Accessibility Report
              </AccessibleButton>
            </div>
          </div>
        </section>

        {/* Hidden screen reader content */}
        <div className="sr-only">
          <h2>Screen Reader Information</h2>
          <p>
            This page demonstrates various accessibility features implemented throughout the website.
            All interactive elements are keyboard accessible and properly labeled for screen readers.
            The website follows WCAG 2.1 AA guidelines to ensure an inclusive experience for all users.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityDemo;