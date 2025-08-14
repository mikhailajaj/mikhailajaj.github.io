"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaExpand, FaCompress } from "react-icons/fa";

// Transition variants for different effects
export const transitionVariants = {
  // Slide transitions
  slideLeft: {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 }
  },
  slideRight: {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 }
  },
  slideUp: {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 }
  },
  slideDown: {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 }
  },

  // Scale transitions
  scaleIn: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 }
  },
  scaleOut: {
    initial: { scale: 1.2, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 }
  },

  // Fade transitions
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  fadeBlur: {
    initial: { opacity: 0, filter: "blur(10px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(10px)" }
  },

  // Flip transitions
  flipX: {
    initial: { rotateX: 90, opacity: 0 },
    animate: { rotateX: 0, opacity: 1 },
    exit: { rotateX: -90, opacity: 0 }
  },
  flipY: {
    initial: { rotateY: 90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    exit: { rotateY: -90, opacity: 0 }
  },

  // Elastic transitions
  elastic: {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100
      }
    },
    exit: { scale: 0, opacity: 0 }
  }
};

// Page transition wrapper
export const PageTransition: React.FC<{
  children: React.ReactNode;
  variant?: keyof typeof transitionVariants;
  duration?: number;
  className?: string;
}> = ({ children, variant = "fade", duration = 0.3, className = "" }) => {
  const shouldReduceMotion = useReducedMotion();
  const variants = shouldReduceMotion ? transitionVariants.fade : transitionVariants[variant];

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ duration }}
    >
      {children}
    </motion.div>
  );
};

// Modal transition
export const ModalTransition: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  variant?: "scale" | "slide" | "fade";
  backdrop?: boolean;
}> = ({ isOpen, onClose, children, variant = "scale", backdrop = true }) => {
  const shouldReduceMotion = useReducedMotion();

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    scale: {
      hidden: { scale: 0.8, opacity: 0 },
      visible: { scale: 1, opacity: 1 }
    },
    slide: {
      hidden: { y: "100%", opacity: 0 },
      visible: { y: 0, opacity: 1 }
    },
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    }
  };

  const currentVariants = shouldReduceMotion ? modalVariants.fade : modalVariants[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {backdrop && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={onClose}
            />
          )}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            variants={currentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Accordion transition
export const AccordionTransition: React.FC<{
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ isOpen, children, className = "" }) => {
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={false}
      animate={{
        height: isOpen ? "auto" : 0,
        opacity: isOpen ? 1 : 0
      }}
      transition={{
        height: { duration: 0.3, ease: "easeInOut" },
        opacity: { duration: 0.2, delay: isOpen ? 0.1 : 0 }
      }}
    >
      <div className="p-4">
        {children}
      </div>
    </motion.div>
  );
};

// Tab transition
export const TabTransition: React.FC<{
  activeTab: string;
  tabs: Array<{ id: string; label: string; content: React.ReactNode }>;
  onTabChange: (tabId: string) => void;
  className?: string;
}> = ({ activeTab, tabs, onTabChange, className = "" }) => {
  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-4 py-2 font-medium transition-colors ${
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                layoutId="activeTab"
                transition={{ duration: 0.3 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {tabs.map((tab) => (
            activeTab === tab.id && (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="py-4"
              >
                {tab.content}
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Carousel transition
export const CarouselTransition: React.FC<{
  items: React.ReactNode[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}> = ({ items, currentIndex, onIndexChange, autoPlay = false, interval = 3000, className = "" }) => {
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      onIndexChange((currentIndex + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, autoPlay, interval, items.length, onIndexChange]);

  const goToPrevious = () => {
    onIndexChange(currentIndex === 0 ? items.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    onIndexChange((currentIndex + 1) % items.length);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Carousel Content */}
      <div className="relative h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {items[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
      >
        <FaArrowLeft className="w-4 h-4" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
      >
        <FaArrowRight className="w-4 h-4" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => onIndexChange(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Staggered reveal transition
export const StaggeredReveal: React.FC<{
  children: React.ReactNode[];
  staggerDelay?: number;
  variant?: "fadeUp" | "fadeIn" | "scaleIn";
  className?: string;
}> = ({ children, staggerDelay = 0.1, variant = "fadeUp", className = "" }) => {
  const variants = {
    fadeUp: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 }
    }
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={variants[variant]}
          transition={{ duration: 0.5 }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Demo component showcasing all transition effects
const TransitionEffects: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState<"scale" | "slide" | "fade">("scale");
  const [activeTab, setActiveTab] = useState("tab1");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [accordionOpen, setAccordionOpen] = useState(false);

  const tabs = [
    {
      id: "tab1",
      label: "Overview",
      content: <div className="p-4 bg-card rounded-lg">This is the overview tab content with smooth transitions.</div>
    },
    {
      id: "tab2",
      label: "Details",
      content: <div className="p-4 bg-card rounded-lg">This is the details tab content with animated transitions.</div>
    },
    {
      id: "tab3",
      label: "Settings",
      content: <div className="p-4 bg-card rounded-lg">This is the settings tab content with fluid animations.</div>
    }
  ];

  const carouselItems = [
    <div key="1" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-8 rounded-lg text-center">
      <h3 className="text-2xl font-bold mb-4">Slide 1</h3>
      <p>Beautiful carousel transitions with smooth animations</p>
    </div>,
    <div key="2" className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-8 rounded-lg text-center">
      <h3 className="text-2xl font-bold mb-4">Slide 2</h3>
      <p>Responsive design with touch-friendly controls</p>
    </div>,
    <div key="3" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 rounded-lg text-center">
      <h3 className="text-2xl font-bold mb-4">Slide 3</h3>
      <p>Auto-play functionality with manual override</p>
    </div>
  ];

  return (
    <div className="p-8 space-y-12 bg-background">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Transition Effects
        </h2>
        <p className="text-muted-foreground">
          Smooth transitions and animations for enhanced user experience
        </p>
      </div>

      {/* Modal Transitions */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground">Modal Transitions</h3>
        <div className="flex flex-wrap gap-4">
          {(["scale", "slide", "fade"] as const).map((variant) => (
            <button
              key={variant}
              onClick={() => {
                setModalVariant(variant);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              {variant.charAt(0).toUpperCase() + variant.slice(1)} Modal
            </button>
          ))}
        </div>
      </section>

      {/* Tab Transitions */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground">Tab Transitions</h3>
        <TabTransition
          activeTab={activeTab}
          tabs={tabs}
          onTabChange={setActiveTab}
          className="bg-card border border-border rounded-lg p-4"
        />
      </section>

      {/* Accordion Transition */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground">Accordion Transition</h3>
        <div className="bg-card border border-border rounded-lg">
          <button
            onClick={() => setAccordionOpen(!accordionOpen)}
            className="w-full px-4 py-3 text-left font-medium text-foreground hover:bg-muted/50 transition-colors flex items-center justify-between"
          >
            Click to expand/collapse
            <motion.div
              animate={{ rotate: accordionOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {accordionOpen ? <FaCompress /> : <FaExpand />}
            </motion.div>
          </button>
          <AccordionTransition isOpen={accordionOpen}>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                This is the accordion content that smoothly expands and collapses with height and opacity transitions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Feature 1</h4>
                  <p className="text-sm text-muted-foreground">Description of feature 1</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Feature 2</h4>
                  <p className="text-sm text-muted-foreground">Description of feature 2</p>
                </div>
              </div>
            </div>
          </AccordionTransition>
        </div>
      </section>

      {/* Carousel Transition */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground">Carousel Transition</h3>
        <CarouselTransition
          items={carouselItems}
          currentIndex={carouselIndex}
          onIndexChange={setCarouselIndex}
          autoPlay={false}
          className="h-64 bg-card border border-border rounded-lg"
        />
      </section>

      {/* Staggered Reveal */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground">Staggered Reveal</h3>
        <StaggeredReveal className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            "First item reveals",
            "Second item follows",
            "Third item completes the sequence"
          ].map((text, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold">{index + 1}</span>
              </div>
              <p className="text-foreground">{text}</p>
            </div>
          ))}
        </StaggeredReveal>
      </section>

      {/* Modal */}
      <ModalTransition
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        variant={modalVariant}
      >
        <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full">
          <h3 className="text-xl font-bold text-foreground mb-4">
            {modalVariant.charAt(0).toUpperCase() + modalVariant.slice(1)} Modal
          </h3>
          <p className="text-muted-foreground mb-6">
            This modal demonstrates the {modalVariant} transition effect with smooth animations.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </ModalTransition>
    </div>
  );
};

export default TransitionEffects;
