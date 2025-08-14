"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { SALLY_TIMING } from "@/components/ui/animation/SallyAnimationSystem";
import { useSallyAccessibility } from "@/components/accessibility";

/**
 * Sally's Advanced HCI System
 * Phase 3: Biometric-Responsive & AI-Enhanced Components
 * Based on cutting-edge HCI research and adaptive user interfaces
 */

// Biometric and Context Data Types
interface BiometricData {
  stressLevel: "low" | "medium" | "high" | "critical";
  cognitiveLoad: number; // 0-100
  attentionLevel: "focused" | "distracted" | "overwhelmed";
  interactionSpeed: "slow" | "normal" | "fast";
  errorRate: number; // 0-1
}

interface ContextualData {
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  deviceType: "mobile" | "tablet" | "desktop" | "tv";
  networkSpeed: "slow" | "medium" | "fast";
  batteryLevel: number; // 0-100
  ambientLight: "dark" | "dim" | "normal" | "bright";
  noiseLevel: "quiet" | "normal" | "noisy";
}

interface UserBehaviorPattern {
  preferredInteractionStyle: "touch" | "mouse" | "keyboard" | "voice";
  averageSessionDuration: number;
  commonTaskSequences: string[];
  errorPatterns: string[];
  preferredContentDensity: "minimal" | "moderate" | "dense";
  adaptationSpeed: "slow" | "medium" | "fast";
}

// Advanced HCI Context
interface AdvancedHCIContext {
  biometrics: BiometricData;
  context: ContextualData;
  userPattern: UserBehaviorPattern;
  adaptiveMode: boolean;
  aiPredictions: {
    nextAction: string | null;
    confidence: number;
    suggestedOptimizations: string[];
  };
  performanceMetrics: {
    renderTime: number;
    interactionLatency: number;
    errorCount: number;
    satisfactionScore: number;
  };
}

const AdvancedHCIContext = createContext<
  AdvancedHCIContext & {
    updateBiometrics: (data: Partial<BiometricData>) => void;
    updateContext: (data: Partial<ContextualData>) => void;
    recordInteraction: (
      action: string,
      success: boolean,
      duration: number,
    ) => void;
    predictNextAction: () => string | null;
  }
>({
  biometrics: {
    stressLevel: "medium",
    cognitiveLoad: 50,
    attentionLevel: "focused",
    interactionSpeed: "normal",
    errorRate: 0.1,
  },
  context: {
    timeOfDay: "afternoon",
    deviceType: "desktop",
    networkSpeed: "fast",
    batteryLevel: 100,
    ambientLight: "normal",
    noiseLevel: "normal",
  },
  userPattern: {
    preferredInteractionStyle: "mouse",
    averageSessionDuration: 300,
    commonTaskSequences: [],
    errorPatterns: [],
    preferredContentDensity: "moderate",
    adaptationSpeed: "medium",
  },
  adaptiveMode: true,
  aiPredictions: {
    nextAction: null,
    confidence: 0,
    suggestedOptimizations: [],
  },
  performanceMetrics: {
    renderTime: 0,
    interactionLatency: 0,
    errorCount: 0,
    satisfactionScore: 0.8,
  },
  updateBiometrics: () => {},
  updateContext: () => {},
  recordInteraction: () => {},
  predictNextAction: () => null,
});

// Sally's Biometric-Responsive Button
interface SallyBiometricButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success";
  adaptToStress?: boolean;
  predictiveHover?: boolean;
  className?: string;
}

export function SallyBiometricButton({
  children,
  variant = "primary",
  adaptToStress = true,
  predictiveHover = true,
  className,
  onClick,
  ...props
}: SallyBiometricButtonProps) {
  const { biometrics, recordInteraction, aiPredictions } =
    useContext(AdvancedHCIContext);
  const { announce } = useSallyAccessibility();
  const prefersReducedMotion = useReducedMotion();

  const [isHovered, setIsHovered] = useState(false);
  const [isPredictedNext, setIsPredictedNext] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Biometric-responsive styling
  const getStressAdaptedStyle = () => {
    if (!adaptToStress) return {};

    switch (biometrics.stressLevel) {
      case "critical":
      case "high":
        return {
          scale: 1.1, // Larger targets for stressed users
          padding: "16px 24px",
          fontSize: "18px",
          borderWidth: "3px",
          animationDuration: 0.1, // Faster feedback
        };
      case "medium":
        return {
          scale: 1.05,
          padding: "12px 20px",
          fontSize: "16px",
          borderWidth: "2px",
          animationDuration: 0.2,
        };
      case "low":
        return {
          scale: 1,
          padding: "8px 16px",
          fontSize: "14px",
          borderWidth: "1px",
          animationDuration: 0.3,
        };
    }
  };

  // AI-powered predictive hover
  useEffect(() => {
    if (predictiveHover && aiPredictions.nextAction) {
      const buttonText = typeof children === "string" ? children : "";
      if (
        aiPredictions.nextAction.includes(buttonText.toLowerCase()) &&
        aiPredictions.confidence > 0.7
      ) {
        setIsPredictedNext(true);

        // Subtle pre-hover effect
        setTimeout(() => {
          if (buttonRef.current && !isHovered) {
            buttonRef.current.style.transform = "scale(1.02)";
            buttonRef.current.style.boxShadow =
              "0 4px 12px rgba(59, 130, 246, 0.3)";
          }
        }, 500);
      }
    }
  }, [aiPredictions, predictiveHover, children, isHovered]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const startTime = performance.now();

    try {
      onClick?.(e);
      const endTime = performance.now();

      // Record successful interaction
      recordInteraction(`button_click_${variant}`, true, endTime - startTime);

      // Stress-adapted feedback
      if (
        biometrics.stressLevel === "high" ||
        biometrics.stressLevel === "critical"
      ) {
        announce("Action completed successfully");
      }
    } catch (error) {
      const endTime = performance.now();
      recordInteraction(`button_click_${variant}`, false, endTime - startTime);
    }
  };

  const stressStyle = getStressAdaptedStyle();

  return (
    <motion.button
      ref={buttonRef}
      className={cn(
        "sally-biometric-button relative overflow-hidden rounded-lg font-medium",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "transition-all duration-200",

        // Variant styles
        variant === "primary" &&
          "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        variant === "secondary" &&
          "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
        variant === "danger" &&
          "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        variant === "success" &&
          "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",

        // Stress-adapted classes
        biometrics.stressLevel === "high" && "ring-2 ring-yellow-400",
        biometrics.stressLevel === "critical" &&
          "ring-4 ring-red-400 shadow-lg",

        // Predictive styling
        isPredictedNext && "ring-2 ring-purple-400 shadow-purple-200",

        className,
      )}
      style={{
        padding: stressStyle.padding,
        fontSize: stressStyle.fontSize,
        borderWidth: stressStyle.borderWidth,
        minHeight: biometrics.stressLevel === "critical" ? "56px" : "44px",
        minWidth: biometrics.stressLevel === "critical" ? "120px" : "88px",
      }}
      whileHover={
        !prefersReducedMotion
          ? {
              scale: stressStyle.scale,
              transition: { duration: stressStyle.animationDuration },
            }
          : {}
      }
      whileTap={
        !prefersReducedMotion
          ? {
              scale: 0.95,
              transition: { duration: 0.1 },
            }
          : {}
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      {...props}
    >
      {/* Stress indicator */}
      {biometrics.stressLevel === "critical" && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse" />
      )}

      {/* Predictive indicator */}
      {isPredictedNext && (
        <div className="absolute top-1 left-1 w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
      )}

      {children}
    </motion.button>
  );
}

// Sally's Context-Aware Layout
interface SallyContextAwareLayoutProps {
  children: React.ReactNode;
  adaptToEnvironment?: boolean;
  optimizeForBattery?: boolean;
}

export function SallyContextAwareLayout({
  children,
  adaptToEnvironment = true,
  optimizeForBattery = true,
}: SallyContextAwareLayoutProps) {
  const { context, biometrics, updateContext } = useContext(AdvancedHCIContext);
  const [layoutDensity, setLayoutDensity] = useState<
    "compact" | "normal" | "spacious"
  >("normal");
  const [colorScheme, setColorScheme] = useState<
    "auto" | "light" | "dark" | "high-contrast"
  >("auto");

  // Environmental adaptation
  useEffect(() => {
    if (!adaptToEnvironment) return;

    // Adapt to ambient light
    if (context.ambientLight === "dark") {
      setColorScheme("dark");
    } else if (context.ambientLight === "bright") {
      setColorScheme("light");
    }

    // Adapt to device and battery
    if (optimizeForBattery && context.batteryLevel < 20) {
      setLayoutDensity("compact");
      // Reduce animations and effects
    }

    // Adapt to time of day
    const hour = new Date().getHours();
    if (hour >= 22 || hour <= 6) {
      setColorScheme("dark");
    }

    // Adapt to stress level
    if (
      biometrics.stressLevel === "high" ||
      biometrics.stressLevel === "critical"
    ) {
      setLayoutDensity("spacious"); // More breathing room for stressed users
    }
  }, [context, biometrics, adaptToEnvironment, optimizeForBattery]);

  // Auto-detect environmental changes
  useEffect(() => {
    const detectEnvironmentalChanges = () => {
      // Battery level detection
      if ("getBattery" in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          updateContext({ batteryLevel: battery.level * 100 });
        });
      }

      // Network speed detection
      if ("connection" in navigator) {
        const connection = (navigator as any).connection;
        const effectiveType = connection.effectiveType;

        let networkSpeed: "slow" | "medium" | "fast" = "medium";
        if (effectiveType === "slow-2g" || effectiveType === "2g") {
          networkSpeed = "slow";
        } else if (effectiveType === "4g") {
          networkSpeed = "fast";
        }

        updateContext({ networkSpeed });
      }

      // Device type detection
      const deviceType =
        window.innerWidth < 768
          ? "mobile"
          : window.innerWidth < 1024
            ? "tablet"
            : "desktop";
      updateContext({ deviceType });
    };

    detectEnvironmentalChanges();

    // Re-detect on resize
    window.addEventListener("resize", detectEnvironmentalChanges);
    return () =>
      window.removeEventListener("resize", detectEnvironmentalChanges);
  }, [updateContext]);

  const layoutClasses = cn(
    "sally-context-aware-layout transition-all duration-500",

    // Density adaptations
    layoutDensity === "compact" && "space-y-2 p-2",
    layoutDensity === "normal" && "space-y-4 p-4",
    layoutDensity === "spacious" && "space-y-8 p-8",

    // Color scheme adaptations
    colorScheme === "high-contrast" && "sally-high-contrast",

    // Battery optimization
    context.batteryLevel < 20 && "reduce-animations low-power-mode",

    // Network optimization
    context.networkSpeed === "slow" && "optimize-for-slow-network",
  );

  return (
    <div className={layoutClasses} data-context-aware="true">
      {/* Environmental status indicator (dev mode only) */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs z-50">
          <div>Battery: {context.batteryLevel}%</div>
          <div>Network: {context.networkSpeed}</div>
          <div>Light: {context.ambientLight}</div>
          <div>Stress: {biometrics.stressLevel}</div>
          <div>Layout: {layoutDensity}</div>
        </div>
      )}

      {children}
    </div>
  );
}

// Sally's AI-Powered Content Predictor
interface SallyContentPredictorProps {
  contentSections: Array<{
    id: string;
    title: string;
    content: React.ReactNode;
    priority: number;
    userInterest: number; // 0-1
  }>;
  maxSections?: number;
  adaptToAttention?: boolean;
}

export function SallyContentPredictor({
  contentSections,
  maxSections = 5,
  adaptToAttention = true,
}: SallyContentPredictorProps) {
  const { biometrics, userPattern, aiPredictions } =
    useContext(AdvancedHCIContext);
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const [sectionOrder, setSectionOrder] = useState<string[]>([]);

  // AI-powered content prioritization
  useEffect(() => {
    const prioritizeContent = () => {
      let sections = [...contentSections];

      // Factor in user attention level
      if (adaptToAttention && biometrics.attentionLevel === "distracted") {
        // Show only high-priority, high-interest content
        sections = sections.filter(
          (s) => s.priority > 0.7 && s.userInterest > 0.6,
        );
      } else if (biometrics.attentionLevel === "overwhelmed") {
        // Show minimal content
        sections = sections.filter((s) => s.priority > 0.8);
      }

      // Sort by combined score
      sections.sort((a, b) => {
        const scoreA = a.priority * 0.6 + a.userInterest * 0.4;
        const scoreB = b.priority * 0.6 + b.userInterest * 0.4;
        return scoreB - scoreA;
      });

      // Limit to maxSections based on cognitive load
      const cognitiveCapacity = Math.max(
        1,
        Math.floor(maxSections * (1 - biometrics.cognitiveLoad / 100)),
      );
      const limitedSections = sections.slice(
        0,
        Math.min(maxSections, cognitiveCapacity),
      );

      setSectionOrder(limitedSections.map((s) => s.id));
      setVisibleSections(limitedSections.map((s) => s.id));
    };

    prioritizeContent();
  }, [contentSections, biometrics, maxSections, adaptToAttention]);

  return (
    <div className="sally-content-predictor space-y-4">
      {/* AI insights (dev mode only) */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-sm">
          <div className="font-medium text-purple-800 dark:text-purple-200">
            🤖 AI Content Optimization
          </div>
          <div className="text-purple-600 dark:text-purple-300 mt-1">
            Showing {visibleSections.length}/{contentSections.length} sections
            based on attention level: {biometrics.attentionLevel}
          </div>
          {aiPredictions.nextAction && (
            <div className="text-purple-600 dark:text-purple-300">
              Predicted next: {aiPredictions.nextAction} (
              {Math.round(aiPredictions.confidence * 100)}%)
            </div>
          )}
        </div>
      )}

      {/* Adaptive content sections */}
      <div className="space-y-4">
        {sectionOrder.map((sectionId, index) => {
          const section = contentSections.find((s) => s.id === sectionId);
          if (!section) return null;

          return (
            <motion.div
              key={sectionId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                duration: SALLY_TIMING.standard,
              }}
              className={cn(
                "sally-adaptive-section",
                biometrics.attentionLevel === "overwhelmed" &&
                  "simplified-layout",
              )}
            >
              <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
              {section.content}
            </motion.div>
          );
        })}
      </div>

      {/* Load more sections if attention improves */}
      {visibleSections.length < contentSections.length &&
        biometrics.attentionLevel === "focused" && (
          <motion.button
            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              const remainingSections = contentSections
                .filter((s) => !visibleSections.includes(s.id))
                .slice(0, 2)
                .map((s) => s.id);
              setVisibleSections((prev) => [...prev, ...remainingSections]);
            }}
          >
            Load More Content ({contentSections.length - visibleSections.length}{" "}
            remaining)
          </motion.button>
        )}
    </div>
  );
}

// Sally's Advanced HCI Provider
interface SallyAdvancedHCIProviderProps {
  children: React.ReactNode;
  enableBiometrics?: boolean;
  enableAI?: boolean;
  enableContextAwareness?: boolean;
}

export function SallyAdvancedHCIProvider({
  children,
  enableBiometrics = true,
  enableAI = true,
  enableContextAwareness = true,
}: SallyAdvancedHCIProviderProps) {
  const [hciState, setHciState] = useState<AdvancedHCIContext>({
    biometrics: {
      stressLevel: "medium",
      cognitiveLoad: 50,
      attentionLevel: "focused",
      interactionSpeed: "normal",
      errorRate: 0.1,
    },
    context: {
      timeOfDay: "afternoon",
      deviceType: "desktop",
      networkSpeed: "fast",
      batteryLevel: 100,
      ambientLight: "normal",
      noiseLevel: "normal",
    },
    userPattern: {
      preferredInteractionStyle: "mouse",
      averageSessionDuration: 300,
      commonTaskSequences: [],
      errorPatterns: [],
      preferredContentDensity: "moderate",
      adaptationSpeed: "medium",
    },
    adaptiveMode: true,
    aiPredictions: {
      nextAction: null,
      confidence: 0,
      suggestedOptimizations: [],
    },
    performanceMetrics: {
      renderTime: 0,
      interactionLatency: 0,
      errorCount: 0,
      satisfactionScore: 0.8,
    },
    updateBiometrics: () => {},
    updateContext: () => {},
    recordInteraction: () => {},
    predictNextAction: () => null,
  });

  // Biometric simulation (in real app, this would connect to actual sensors)
  useEffect(() => {
    if (!enableBiometrics) return;

    const simulateBiometrics = () => {
      // Simulate stress level changes based on interaction patterns
      const errorRate = hciState.performanceMetrics.errorCount / 10;
      let stressLevel: "low" | "medium" | "high" | "critical" = "medium";

      if (errorRate > 0.3) stressLevel = "critical";
      else if (errorRate > 0.2) stressLevel = "high";
      else if (errorRate < 0.1) stressLevel = "low";

      // Simulate cognitive load based on time and interactions
      const cognitiveLoad = Math.min(
        100,
        30 + errorRate * 50 + Math.random() * 20,
      );

      setHciState((prev) => ({
        ...prev,
        biometrics: {
          ...prev.biometrics,
          stressLevel,
          cognitiveLoad,
        },
      }));
    };

    const interval = setInterval(simulateBiometrics, 5000);
    return () => clearInterval(interval);
  }, [enableBiometrics, hciState.performanceMetrics.errorCount]);

  // AI prediction system
  useEffect(() => {
    if (!enableAI) return;

    const generatePredictions = () => {
      // Simple AI prediction based on user patterns
      const commonActions = [
        "view projects",
        "contact form",
        "download resume",
        "read blog",
      ];
      const nextAction =
        commonActions[Math.floor(Math.random() * commonActions.length)];
      const confidence = 0.6 + Math.random() * 0.3;

      setHciState((prev) => ({
        ...prev,
        aiPredictions: {
          nextAction,
          confidence,
          suggestedOptimizations: [
            "Increase button size for better accessibility",
            "Reduce animation complexity for better performance",
            "Simplify navigation for cognitive load reduction",
          ],
        },
      }));
    };

    const interval = setInterval(generatePredictions, 10000);
    return () => clearInterval(interval);
  }, [enableAI]);

  const updateBiometrics = useCallback((data: Partial<BiometricData>) => {
    setHciState((prev) => ({
      ...prev,
      biometrics: { ...prev.biometrics, ...data },
    }));
  }, []);

  const updateContext = useCallback((data: Partial<ContextualData>) => {
    setHciState((prev) => ({
      ...prev,
      context: { ...prev.context, ...data },
    }));
  }, []);

  const recordInteraction = useCallback(
    (action: string, success: boolean, duration: number) => {
      setHciState((prev) => ({
        ...prev,
        performanceMetrics: {
          ...prev.performanceMetrics,
          interactionLatency: duration,
          errorCount: success
            ? prev.performanceMetrics.errorCount
            : prev.performanceMetrics.errorCount + 1,
          satisfactionScore: success
            ? Math.min(1, prev.performanceMetrics.satisfactionScore + 0.01)
            : Math.max(0, prev.performanceMetrics.satisfactionScore - 0.05),
        },
      }));
    },
    [],
  );

  const predictNextAction = useCallback(() => {
    return hciState.aiPredictions.nextAction;
  }, [hciState.aiPredictions.nextAction]);

  const contextValue = {
    ...hciState,
    updateBiometrics,
    updateContext,
    recordInteraction,
    predictNextAction,
  };

  return (
    <AdvancedHCIContext.Provider value={contextValue}>
      {children}
    </AdvancedHCIContext.Provider>
  );
}

// Hook to use advanced HCI context
export function useSallyAdvancedHCI() {
  return useContext(AdvancedHCIContext);
}
